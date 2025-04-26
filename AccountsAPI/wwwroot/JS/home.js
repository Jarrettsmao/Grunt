let map;

async function initMap(){
    //the location of uluru
    const position = { lat: -25.344, lng:131.031};
    //Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    //the map centered at uluru
    map = new Map (document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    //the marker
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Uluru",
    });
}

window.addEventListener("DOMContentLoaded", () => {
    initMap();
  });
  