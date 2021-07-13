mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let map = new mapboxgl.Map({
  container: 'exploreMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckqv6bmld0mu917qsfxupq41d/draft", // style URL
  center: [-84.319,33.854], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 12.3, // starting zoom
  interactive: false

});

function openMap() {
  map.on('load', function() {
    console.log(map.getStyle().layers)

    let layerLabels = map.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School']]
    map.setFilter(layerLabels, filtersLabels);

    map.setPaintProperty("ashfordlewis-old-sab", 'line-opacity', 1);

    map.getLayer("ashfordlewis-old-sab").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})

    map.setPaintProperty("scrollyschools-labels", 'text-opacity', 1);

    map.getLayer("scrollyschools-labels").setPaintProperty('text-opacity-transition', {duration: 2000, delay: 0})

    map.setPaintProperty("scrollyschools-labels", 'icon-opacity', 1);

    map.getLayer("scrollyschools-labels").setPaintProperty('icon-opacity-transition', {duration: 2000, delay: 0})

  });
}

function addDots() {
  map.setPaintProperty("dots-black-hispanic", 'circle-radius', 1.5);

  map.getLayer("dots-black-hispanic").setPaintProperty('circle-radius-transition', {duration: 2000, delay: 0})

  map.setPaintProperty("dots-others", 'circle-radius', 1.5);

  map.getLayer("dots-others").setPaintProperty('circle-radius-transition', {duration: 4000, delay: 0})

}

function newBoundaries() {

}
