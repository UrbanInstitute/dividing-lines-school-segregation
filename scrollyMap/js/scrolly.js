mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let map = new mapboxgl.Map({
  container: 'exploreMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckqv6bmld0mu917qsfxupq41d/draft", // style URL
  center: [-84.319,33.826], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 12.5 // starting zoom

});

map.on('load', function() {
  console.log(map.getStyle().layers)
  var test = map.queryRenderedFeatures({ layers: ['ashfordlewis-old-sab']});
  var test2 = map.queryRenderedFeatures({ layers: ['ashfordlewis-new-sab']});
  //
  console.log(test)
  console.log(test2)
});
