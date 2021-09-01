mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let introMap = new mapboxgl.Map({
  container: 'introMap', // container ID
  style: "mapbox://styles/urbaninstitute/cksamqg5n0t7f18t59c0b124x", // style URL
  center: [-84.332476, 33.843571], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 15, // starting zoom,
  attributionControl: true,
  interactive: false

});

introMap.on('load', function() {

  introMap.resize();

  introMap.zoomTo(12, {
    duration: 10000,
    offset: [0, 0],
    essential: true
  });
})
