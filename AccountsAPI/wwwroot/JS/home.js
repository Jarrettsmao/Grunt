let map;
let geocoder;
let places;

window.addEventListener("DOMContentLoaded", async () => {
    await initMap();
    setupSearchListeners();
});

async function initMap() {
    // Load libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    places = await google.maps.importLibrary("places"); // ✅ new Places API

    const position = { lat: 37, lng: -120 };
    map = new Map(document.getElementById("map"), {
        zoom: 8,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    geocoder = new Geocoder();

    const areacode = localStorage.getItem("areacode");
    geocoder.geocode({ address: areacode }, (results, status) => {
        if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(12);
        } else {
            console.warn("Could not geocode area code:", status);
        }
    });

}

function setupSearchListeners() {
    const areaInput = document.getElementById("zipCodeSearch");
    const locationInput = document.getElementById("locationSearch");
    const button = document.getElementById("searchBtn");

    button.addEventListener("click", () => {
        let zipVal = areaInput.value.trim();
        const locationVal = locationInput.value.trim();
        if (!zipVal) {
            zipVal = localStorage.getItem("areacode");
        }
        
        const fullQuery = locationVal ? `${locationVal} ${zipVal}` : zipVal;
        geocodeAndSearch(fullQuery, locationVal, zipVal);
    });

    [areaInput, locationInput].forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                let zipVal = areaInput.value.trim();
                const locationVal = locationInput.value.trim();
                if (!zipVal) {
                    zipVal = localStorage.getItem("areacode");
                }
                const fullQuery = locationVal ? `${locationVal} ${zipVal}` : zipVal;
                geocodeAndSearch(fullQuery, locationVal, zipVal);
            }
        });
    });
}

function geocodeAndSearch(fullQuery, locationName, zipCode) {
    geocoder.geocode({ address: fullQuery }, (results, status) => {
        if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;
            map.setCenter(location);

            //decide between searching just zip or restaurant & zip
            if (locationName) {
                restaurantSearch(location, locationName, zipCode);
            } else {
                areaCodeSearch(location);
            }
        } else {
            console.error("Geocode was not successful:", status);
            alert("Location not found.");
        }
    });
}

async function restaurantSearch(mapCenter, restaurantName, zipCode){
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");

    // const restaurantName =     
    const textQuery = `${restaurantName} restaurant ${zipCode}`;

    const request = {
        textQuery: textQuery,
        fields: ["id", "displayName", "location", "businessStatus", "formattedAddress"],
        maxResultCount: 5,
        language: "en-US",
        region: "us",
        // locationBias: mapCenter
    };

    console.log("rest search");

    try {
        const { places } = await Place.searchByText(request);
        const infoWindow = new google.maps.InfoWindow();
    
        if (places.length) {
            const bounds = new LatLngBounds();
    
            //adds markers to search results
            for (const place of places) {
                const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName, 
            });

            const name = place.displayName;
            const address = place.formattedAddress;
            const placeId = place.id;
            // const query = `${name} restaurant ${address}`;

            const mapsUrl = new URL('/restaurants/page', window.location.origin);
            mapsUrl.searchParams.set('id', placeId);
            mapsUrl.searchParams.set('name', name);
          
            // window.location.href = mapsUrl.toString();

            marker.addListener("gmp-click", () => {
                infoWindow.setContent(`
                    <strong>${name}</strong><br>
                    // use grunt rating here<br> 
                    ${address}<br>
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">View restaurant details</a>`
                );
                infoWindow.open(map, marker);
            })
            console.log("Place ID:", placeId);
    
            bounds.extend(place.location);
          }
    
        map.fitBounds(bounds);
        } else {
          console.log("No restaurants found.");
        }
      } catch (error) {
        console.error("Error searching for restaurants:", error);
      }
}

async function areaCodeSearch(mapCenter) {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");

    const request = {
        fields: ["id", "displayName", "location", "businessStatus", "formattedAddress"],
        locationRestriction: {
          center: mapCenter,
          radius: 5000
        },
        includedPrimaryTypes: ["restaurant"],
        maxResultCount: 20,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: "en-US",
        region: "us"
    };

    try {
        const { places } = await Place.searchNearby(request);
        const infoWindow = new google.maps.InfoWindow();
    
        if (places.length) {
            const bounds = new LatLngBounds();
    
            //adds markers to search results
            for (const place of places) {
                const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName, 
            });

            const name = place.displayName;
            const address = place.formattedAddress;
            const placeId = place.id;
            const mapsUrl = new URL('/restaurants/page', window.location.origin);
            mapsUrl.searchParams.set('id', placeId);
            mapsUrl.searchParams.set('name', name);

            marker.addListener("gmp-click", () => {
                infoWindow.setContent(`
                    <strong>${name}</strong><br>
                    // use grunt rating here<br> 
                    ${address}<br>
                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">View restaurant details</a>`
                );
                infoWindow.open(map, marker);
            })
            
    
            bounds.extend(place.location);
          }
    
        map.fitBounds(bounds);
        } else {
          console.log("No restaurants found.");
        }
      } catch (error) {
        console.error("Nearby search failed:", error);
      }
}
