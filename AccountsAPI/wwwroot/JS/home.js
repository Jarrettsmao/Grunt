let map;
let geocoder;
let places;

window.addEventListener("DOMContentLoaded", async () => {
    await InitMap();
    SetupSearchListeners();
});

async function InitMap() {
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

function SetupSearchListeners() {
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
        GeocodeAndSearch(fullQuery, locationVal, zipVal);
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
                GeocodeAndSearch(fullQuery, locationVal, zipVal);
            }
        });
    });
}

function GeocodeAndSearch(fullQuery, locationName, zipCode) {
    geocoder.geocode({ address: fullQuery }, (results, status) => {
        if (status === "OK" && results.length > 0) {
            const location = results[0].geometry.location;
            map.setCenter(location);

            //decide between searching  zip, city, or restaurant & zip
            if (locationName) {
                RestaurantSearch(location, locationName, zipCode);
            } else if (Number.isInteger(zipCode)){
                AreaCodeSearch(location);
            } else {
                CitySearch(location, zipCode);
            }
        } else {
            console.error("Geocode was not successful:", status);
            alert("Location not found.");
        }
    });
}

async function RestaurantSearch(/*mapCenter,*/ restaurantName, zipCode){
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");

    const textQuery = `${restaurantName} restaurant ${zipCode}`;

    const request = {
        textQuery: textQuery,
        fields: ["id", "displayName", "location", "businessStatus", "formattedAddress"],
        maxResultCount: 5,
        language: "en-US",
        region: "us",
        // locationBias: mapCenter
    };

    try {
        const { places } = await Place.searchByText(request);
       CreateMarker(places);
    } catch (error) {
        console.error("Error searching for restaurants:", error);
    }
}

async function AreaCodeSearch(mapCenter) {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");

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
        CreateMarker(places);
    } catch (error) {
        console.error("Nearby search failed:", error);
    }
}

async function CitySearch(mapCenter, cityName){
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const areaCode = localStorage.getItem("areacode");

    //build query
    const cityQuery = `${cityName} ${areaCode}`;

    const request = {
        fields: ["id", "displayName", "location", "businessStatus", "formattedAddress"],
        locationRestriction: {
            center: mapCenter,
            radius: 5000
        },
        includedPrimaryTypes: ["restaurant"], // You can modify the primary types if necessary
        // maxResultCount: 20,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: "en-US",
        region: "us"
    };

    try {
        const { places} = await Place.searchNearby(request);
        CreateMarker(places);
    } catch (error) {
        console.error("City search failed:", error);
    }
}

async function CreateMarker(places){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const { LatLngBounds } = await google.maps.importLibrary("core");

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

        //Fetch rating from your API
        const {rating, numReviews} = await FetchRestaurantRating(placeId);

        mapsUrl.searchParams.set('id', placeId);
        mapsUrl.searchParams.set('name', name);
        mapsUrl.searchParams.set('rating', rating);
        mapsUrl.searchParams.set('numReviews', numReviews);

        marker.addListener("gmp-click", () => {
            infoWindow.setContent(`
                <strong>${name}</strong><br>
                ⭐${rating} (${numReviews})<br> 
                ${address}<br>
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" id="marker">View restaurant details</a>`
            );
            infoWindow.open(map, marker);
        })
        bounds.extend(place.location);
      }

    map.fitBounds(bounds);
    } else {
      console.log("No restaurants found.");
    }
}

async function FetchRestaurantRating(placeId){
    try {
        const ratingUrl = new URL("https://localhost:8080/Reviews/GetRatingAndReviews", window.location.origin);
        ratingUrl.searchParams.set('placeId', placeId);
        const response = await fetch(ratingUrl);

        const data = await response.json();

        //Handle missing data
        const rating = data.rating || 'N/A';
        const numReviews = data.numReviews || 0;

        return {rating, numReviews};
    } catch (error) {
        console.error("Failed to fetch rating", error);
        return { rating: 'N/A', numReviews: 0 };  // Return defaults in case of an error
    }
}

// async function GetTopRestaurants(location){
//     console.log("getting top restaurants");

//     const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");

//     const request = {
//         fields:["id", "displayName"],
//         locationRestriction: {
//             center: location,
//             radius: 3000
//         },
//         includedPrimaryTypes:["restaurant"],
//         maxResultCount: 3,
//         rankPreference: SearchNearbyRankPreference.POPULARITY,
//         language: "en-US",
//         region: "us"
//     };

//     try {
//         const { places } = await Place.searchNearby(request);

//         // // Sort places by popularity if it's available, and take the top 3
//         // const top3Places = places
//         //     .sort((a, b) => b.popularity - a.popularity)  // Sort descending by popularity
//         //     .slice(0, 3);  // Take the top 3

//         // // Return or log the top 3 places
//         // console.log(top3Places);

//         // // You can now return the data, use it elsewhere, or process it as needed
//         // return top3Places;

//         console.log("places: " + places);

//         return places;
//     } catch (error) {
//         console.error("Nearby search failed:", error);
//     }
// }

// function displayTopRatedPlaces(places) {
//     console.log("displaying Top");

//     const topRatedSection = document.querySelector('.top-rated-section');

//     // Clear any existing content in the top-rated section
//     topRatedSection.innerHTML = `<h2 id="top-rated-title">Top Rated Near Me</h2>`;

//     // Create a list to display the top 3 places
//     const list = document.createElement('ul');

//     // Loop through the places and create a list item for each
//     places.forEach((place, index) => {
//         const listItem = document.createElement('li');
        
//         // Add content to the list item
//         listItem.innerHTML = `
//             <strong>${index + 1}. ${place.displayName}</strong>
//             Rating: ${place.popularity || 'N/A'}
//             Reviews: ${place.reviewCount || 'N/A'}
//         `;
        
//         // Append the list item to the list
//         list.appendChild(listItem);
//     });

//     // Append the list to the top-rated section
//     topRatedSection.appendChild(list);
// }

