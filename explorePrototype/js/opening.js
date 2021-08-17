mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let introMap = new mapboxgl.Map({
  container: 'introMap', // container ID
  style: "mapbox://styles/urbaninstitute/cksamqg5n0t7f18t59c0b124x/draft", // style URL
  center: [-84.332476, 33.843571], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 17, // starting zoom,
  attributionControl: true,
  interactive: false

});

if(introMap.loaded()) {

} else {

}

// introMap.on('load', function() {
//   console.log("SOY LOAD")
//
// })

introMap.on('load', function() {

  introMap.resize();

  console.log("hola")

  introMap.zoomTo(12, {
    duration: 11000,
    offset: [0, 0],
    essential: true
  });
})
