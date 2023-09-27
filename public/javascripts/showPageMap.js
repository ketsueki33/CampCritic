mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/outdoors-v12", // style URL
    center: campground.geometry.coordinates,
    zoom: 10, // starting zoom
});

// adding map controls to top right of the cluster map
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h6>${campground.title}</h6><p>${campground.location}</p>`
        )
    )
    .addTo(map);
