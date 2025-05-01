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

    const areacode = sessionStorage.getItem("areacode");
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
    const input = document.getElementById("zipCodeSearch");
    const button = document.getElementById("searchBtn");

    button.addEventListener("click", () => {
        const query = input.value.trim();
        if (query) {
            geocodeAndSearch(query);
        } else {
            alert("Please enter a zip code or location.");
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const query = input.value.trim();
            if (query) {
                geocodeAndSearch(query);
            } else {
                alert("Please enter a zip code or location.");
            }
        }
    });
}

function geocodeAndSearch(inputValue) {
    geocoder.geocode({ address: inputValue }, (results, status) => {
        if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            // map.setZoom(12);
            restaurantSearch(location);
        } else {
            console.error("Geocode was not successful:", status);
        }
    });
}

async function restaurantSearch(mapCenter) {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");

    const request = {
        fields: ["displayName", "location", "businessStatus"],
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
    
            for (const place of places) {
                const marker = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName?.text || "Restaurant"
            });

            marker.addListener("gmp-click", () => {
                infoWindow.setContent(`<strong>${place.displayName?.text || "Restaurant"}</strong><br>${place.businessStatus}`);
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
