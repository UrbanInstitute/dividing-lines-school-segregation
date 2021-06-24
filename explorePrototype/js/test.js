const pieWidth = 70,
timeOutLength = 100;

let msa = "Akron, OH"

// piechart builder
function buildRacePie( container, d, ab){
  var black = +d["black" + ab + "_bdy"],
  hisp = +d["hispa" + ab + "_bdy"],
  enr = +d["pop" + ab + "_bdy"]

  // let test = d.filter(city => city.maname === "Atlanta-Sandy Springs-Marietta, GA")

  // let pie = d3.pie()
  //     .sort(null)
  //     .value(d => d.value)

  let arc = d3.arc()
  .innerRadius(pieWidth / 5)
  .outerRadius(pieWidth / 2 - 1)

  const arcs = d3.pie()([ black, hisp, enr-black-hisp ]);

  let svg = d3.select(container).append("svg").attr("width", pieWidth).attr("height", pieWidth)
  .append("g")
  .attr("transform", "translate(" + pieWidth/2 + "," + pieWidth/2 + ")")
  .attr("stroke", "white")

  const t = svg.transition()
    .duration(750);

  let pies = svg.selectAll("path")
  .data(arcs)

  console.log(svg)

  pies.join(
    enter => enter.append("path")
    .attr("fill", function(d, i){
      if(d.index == 1) return "#fdbf11"
      else if(d.index == 2) return "#fce39e"
      else return "#1696d2"
    })
    .attr("d", arc)
    .call(enter => enter),
    update => update
    .call(update => update),
    exit => exit
    .call(exit => exit
    .remove())
  )

  // .append("title")
  //   .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

}  // buildRacePie ends here


function updatePies(container, d, ab) {

  var containers = d3.select("#exploreList").selectAll(".exploreContainer")
  var paths  = containers.selectAll("path")
}

function getExploreTitle(d,i){
  return "Boundary " + (i+1)
}


// builds the list of cachments and adds piecharts

function buildExploreList(bb, bbox, msa) {

  console.log(msa)

  bb = bb.filter(function(o){ return o.maname == msa})

  bb = bb.sort(function(a,b){ return +a.bbindex - +b.bbindex })

  var container = d3.select("#exploreList")
  .selectAll(".exploreContainer")
  .data(bb)
  .join("div")
  .attr("class", "exploreContainer")

  container.join(
    enter => enter.append("div")
      .style("background-color", "blue")
      .attr("class", "exploreContainer")
      .call(enter => enter),
    update => update
      .style("background-color", "green")
      .call(update => update),
    exit => exit
      .style("background-color", "red")
      .call(exit => exit
      .remove())
  )

    console.log(container);

  // container.append("div")
  // .attr("class", "exploreTitle")
  // .text(function(d,i){
  //   return getExploreTitle(d,i)
  // })

  // pieA = d3.select("#exploreList")
  // .selectAll(".exploreContainer")
  // .append("div")
  // .attr("class", "pieContainer pieA")

  var pieA = container.append("div")
  .attr("class", "pieContainer pieA")

  // pieA.join(
  //   enter => enter.append("div")
  //   .attr("class", "pieContainer pieA")
  //   .call(enter => enter),
  //   update => update
  //   .call(update => update),
  //   exit => exit
  //   .call(exit => exit
  //   .remove())
  // )

  // pieA.each(function(d){
  //   buildRacePie(this, d, "a")
  // })


  var pieB = container.append("div")
  .attr("class", "pieContainer pieB")

  // pieB = d3.select("#exploreList")
  // .selectAll(".exploreContainer")
  // .append("div")
  // .attr("class", "pieContainer pieB")

  // pieB.join(
  //   enter => enter.append("div")
  //   .attr("class", "pieContainer pieA")
  //   .call(enter => enter),
  //   update => update
  //   .call(update => update),
  //   exit => exit
  //   .call(exit => exit
  //   .remove())
  // )

  // pieB.each(function(d){
  //   buildRacePie(this, d, "b")
  // })

  container.on("click", function(event, d){
    var bboxD = bbox.filter(function(o){

      return o.schida == d.schida && o.schidb == d.schidb
    })[0]

    map.fitBounds(
      [
        [+bboxD.xmin, +bboxD.ymin], // southwestern corner of the bounds
        [+bboxD.xmax, +bboxD.ymax] // northeastern corner of the bounds
      ],
      {
        // "padding": {"top": 10, "bottom":25, "left": 10, "right": 10}, // padding around district, a bit more on bottom to accomodate logo
        "duration": 1000,
        "linear": true,
        "essential": true, // If true , then the animation is considered essential and will not be affected by prefers-reduced-motion .
        "minZoom": 0 // don't hit the minZoom 6 ceiling for the map, so for large distances the flyTo arc isn't truncated
      }
    );

    // console.log(map.getStyle().layers)


    setTimeout(function(){
      //add the overlay layer back
      // map.setLayoutProperty('schooldistricts-fill', 'visibility', 'visible');

      // //show/set active the new district
      // var f2 = map.queryRenderedFeatures({"source": "composite", "layer": "schooldistricts-fill"}).filter(function(o){
      //     return o.id == geoid
      // })
      // for(var i = 0; i < f2.length; i++){
      //     map.setFeatureState(f2[i], { "active": true })
      // }
      // var fs2 = map.queryRenderedFeatures({"layer": "schooldistricts-stroke"}).filter(function(o){
      //     return o.id == geoid
      // })
      // for(var i = 0; i < fs2.length; i++){
      //     map.setFeatureState(fs2[i], { "active": true })
      // }
      // isTransitioning = false;

      var allVisible = map.queryRenderedFeatures({layers: ["sab-badbdy-dh08w0 (1)"] })
      var f1 = map.queryRenderedFeatures({layers: ["sab-badbdy-dh08w0 (1)"] }).filter(function(o){
        return +o.properties.schid == +d.schida || +o.properties.schid == +d.schidb
      })

      for(var i = 0; i < allVisible.length; i++){
        map.setFeatureState(allVisible[i], { "active": false })
      }

      for(var i = 0; i < f1.length; i++){
        map.setFeatureState(f1[i], { "active": true })
      }

    },timeOutLength)


    // var boundary = boundaries.filter(function(o){ return o.geoid == districtId})[0]

    //hide/set inactive the currently selected district

    // for(var i = 0; i < f1.length; i++){
    //     map.setFeatureState(f1[i], { "active": false })
    // }
    // var fs1 = map.queryRenderedFeatures({layer: "schooldistricts-stroke"}).filter(function(o){
    //     return o.id == geoid
    // })
    // for(var i = 0; i < fs1.length; i++){
    //     map.setFeatureState(fs1[i], { "active": false })
    // }

    // //now set new geoid
    // geoid = boundary["geoid"]

    // //hide overlay white layer while zooming, to get a sense
    // //of movement/change in location within US
    // map.setLayoutProperty('schooldistricts-fill', 'visibility', 'none');

  }) //on.click ends here


} // buildExploreList ends here


Promise.all([
  d3.csv("data/source/BB_ALL.csv"),
  d3.csv("data/source/badbdy.csv"),
]).then(function(allData) {
  // files[0] will contain file1.csv
  var bboxData = allData[0],
  bbData = allData[1]

  // console.log(d3.set( bbData.map(function(o){ return o.maname }) ), bbData.map(function(o){ return o.maname }) )
  // console.log( d3.set( bbData.map(function(o){ return o.maname }) ).values() )
  let uniqueMetros = [
    ...new Set(
      bbData.map(function(o){
        return o.maname
      })
      .sort(function(a,b){
        return (a<b) ? - 1: 1;
      })
    )
  ];

  buildExploreList(bbData, bboxData, msa)

  $("#exploreAutocomplete").autocomplete({
    source: uniqueMetros,
    select: function(event, ui) {
      var msa  = ui.item.value
      buildExploreList(bbData, bboxData, msa)

    }
  });

  // files[1] will contain file2.csv
}).catch(function(err) {
  // handle error here
})




// *  When a user clicks the button, `fitBounds()` zooms and pans
// *  the viewport to contain a bounding box that surrounds Kenya.
// *  The [lng, lat] pairs are the southwestern and northeastern
// *  corners of the specified geographical bounds.

// document.getElementById('fit').addEventListener('click', function () {
// map.fitBounds([
// [32.958984, -5.353521], // southwestern corner of the bounds
// [43.50585, 5.615985] // northeastern corner of the bounds
// ]);
// });
