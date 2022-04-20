mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: campground.geometry.coordinates,
  zoom: 8,
});
const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    `${campground.title}`
    );

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);

  map.addControl(new mapboxgl.NavigationControl());