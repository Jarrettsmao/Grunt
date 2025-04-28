let map;
let geocoder;

window.addEventListener("DOMContentLoaded", () => {
    initMap();
  });

document.addEventListener("DOMContentLoaded", ()=> {
    zipCodeSearch();
});

async function initMap(){
    //the location of uluru
    const position = { lat: 37, lng:-120};
    //Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    //the map centered at uluru
    map = new Map (document.getElementById("map"), {
        zoom: 8,
        center: position,
        // mapId: "DEMO_MAP_ID",
    });

    geocoder = new Geocoder();

    //the marker
    // const marker = new AdvancedMarkerElement({
    //     map: map,
    //     position: position,
    //     title: "Uluru",
    // });
}
  
function zipCodeSearch(){
    document.getElementById("searchBtn").addEventListener("click", async function(){
        const zipCode = document.getElementById(`zipCodeSearch`).value.trim();

        if(!zipCode) {
            alert("Please enter an aera code!");
            return;
        }

        geocoder.geocode({ address: zipCode}, (results, status) => {
            if (status === "OK" && results.length > 0){
                const location = results[0].geometry.location;
                map.setCenter(location);
                map.setZoom(12);
            } else {
                alert("Area code not found. Try again!");
            }
        });
    });
}