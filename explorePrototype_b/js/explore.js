const pieWidth = 65,
timeOutLength = 200;

let msa = "Atlanta-Sandy Springs-Marietta, GA";

// defines map
mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let map = new mapboxgl.Map({
  container: 'exploreMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckrasiw7s3ipt17pf3m3mbb4z/draft", // style URL
  center: [-84.331,33.858], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 13, // starting zoom
  interactive: true

});

map.dragPan.disable();
map.dragRotate.disable();
map.keyboard.disable();
map.scrollZoom.disable();

function showLabels(thisSchool, layerNumber, thisLayer) {

  let layerLabels = map.getStyle().layers[layerNumber].id,
  filtersLabels = ["all", ['in', 'schid', thisSchool]]
  map.setFilter(layerLabels, filtersLabels);
  map.setLayoutProperty(thisLayer, 'visibility', 'visible');

}

// function showLabels(thisSchoolA, thisSchoolB) {
//
//   let layerLabels = map.getStyle().layers[85].id,
//   filtersLabels = ["all", ['in', 'schid', thisSchoolA, thisSchoolB]]
//   map.setFilter(layerLabels, filtersLabels);
//   map.setLayoutProperty('labels-schools', 'visibility', 'visible');
//
// }

function showBoundary(thisSchoolA, thisSchoolB) {

  let layerBoundaries = map.getStyle().layers[81].id,
  filterBoundaries = ["all", ['in', 'schida', thisSchoolA], ['in', 'schidb', thisSchoolB]]
  map.setFilter(layerBoundaries, filterBoundaries);
  map.setLayoutProperty('boundaries', 'visibility', 'visible');

  let layerCatchment = map.getStyle().layers[64].id,
  filterCatchment = ["all", ['in', 'schid', thisSchoolA, thisSchoolB]]
  map.setFilter(layerCatchment, filterCatchment);
  map.setLayoutProperty('catchments', 'visibility', 'visible');

}

map.on('load', function() {
  // var test = map.queryRenderedFeatures({ layers: ['labels-schools-a']});
  // var test2 = map.queryRenderedFeatures({ layers: ['boundaries']});
  // console.log(test2)
      // console.log(map.queryRenderedFeatures({ layers: ['catchments']}))
      console.log(map.getStyle().layers)
});

// piechart builder
function buildRacePie(container, d, ab) {
  var black = +d["black" + ab + "_bdy"],
  hisp = +d["hispa" + ab + "_bdy"],
  enr = +d["pop" + ab + "_bdy"]

  let arc = d3.arc()
  .innerRadius(pieWidth / 5)
  .outerRadius(pieWidth / 2 - 1)

  let arcs = d3.pie().sort(null)([ black, hisp, enr-black-hisp ])

  let svg = d3.select(container).append("svg").attr("width", pieWidth).attr("height", pieWidth)
  .append("g")
  .attr("class", "pie")
  .attr("transform", "translate(" + pieWidth/2 + "," + pieWidth/2 + ")")
  .attr("stroke", "white")
  .attr('stroke-width', 1)

  const t = svg.transition()
    .duration(750);

  let pies = svg.selectAll("path")
  .data(arcs)

  pies.join(
    enter => enter.append("path")
    .attr("id", (d, i) => {
      return d.value
    })
    .attr("fill", function(d, i){
      if(i === 0) return "#fdbf11"
      else if(i === 1) return "#ca5800"
      else return "#9d9d9d"
    })
    .attr("d", arc)
    .call(enter => enter),
    update => update
    .call(update => update),
    exit => exit
    .call(exit => exit
    .remove())
  )

  let text = d3.select(container).append("div")
  .attr("class", "text")

  let thisText = text.selectAll('p')
  .data(arcs)

  thisText.join(
    enter => enter.append("p")
  )

  let thePs = container.getElementsByTagName("P"),
  other = enr- (black + hisp),
  blackPct = `${((black / enr) * 100).toFixed(0)}%`,
  hispPct = `${((hisp / enr) * 100).toFixed(0)}%`,
  otherPct = `${((other / enr) * 100).toFixed(0)}%`;

  thePs[0].innerHTML = `${blackPct}`;
  thePs[1].innerHTML = `${hispPct}`;
  thePs[2].innerHTML = `${otherPct}`;
  //
  //
  thePs[0].className = "label black";
  thePs[1].className = "label hisp";
  thePs[2].className = "label other";


}  // buildRacePie() ends here



// centerMap()
function centerMap(bb, bbox) {
  let thisSchoolA = bb[0].schida,
  thisSchoolB = bb[0].schidb;

  let thisCatchment = bbox.filter(t => t.schida === thisSchoolA && t.schidb === thisSchoolB)[0];

  map.fitBounds(
    [
      [+thisCatchment.xmin, +thisCatchment.ymin], // southwestern corner of the bounds
      [+thisCatchment.xmax, +thisCatchment.ymax] // northeastern corner of the bounds
    ],
    {
      // "padding": {"top": 10, "bottom":25, "left": 10, "right": 10}, // padding around district, a bit more on bottom to accomodate logo
      "duration": 1000,
      "linear": true,
      "essential": true, // If true , then the animation is considered essential and will not be affected by prefers-reduced-motion .
      "minZoom": 0 // don't hit the minZoom 6 ceiling for the map, so for large distances the flyTo arc isn't truncated
    }
  );
}

function getExploreTitle(d,i) {
  let schools = `${d.schnamea} and ${d.schnameb}`;
  return schools;
}


// builds the list of cachments and adds piecharts

function buildExploreList(bb, bbox, msa) {

  //https://stackoverflow.com/questions/4777077/removing-elements-by-class-name
    function removeElementsByClass(className){
      const elements = document.getElementsByClassName(className);
      while(elements.length > 0){
          elements[0].parentNode.removeChild(elements[0]);
      }
  }

  bb = bb.filter(function(o){ return o.maname == msa});

  bb = bb.sort(function(a,b){ return +b.bbindex - +a.bbindex });

  let container = d3.select("#exploreList")
  .selectAll(".exploreContainer")
  .data(bb)
  .join("div")
  .attr("class", d => {
    return "exploreContainer"
  })

  container.join(
    enter => enter.append("div")
      .call(enter => enter),
    update => update
      .call(update => update),
    exit => exit
      .call(exit => exit
      .remove())
  )

  removeElementsByClass("exploreTitle")

  container.append("div")
  .attr("class", "exploreTitle")
  .text(function(d,i){
    return getExploreTitle(d,i)
  })

  removeElementsByClass("pieA")
  removeElementsByClass("pieB")
  removeElementsByClass("floater")

  let floater = container.append("div")
  .attr("class", "floater")

  var pieA = container.append("div")
  .attr("class", "pieContainer pieA")

  pieA.each(function(d){
    buildRacePie(this, d, "a")
  })

  var pieB = container.append("div")
  .attr("class", "pieContainer pieB")

  pieB.each(function(d){
    buildRacePie(this, d, "b")
  })

  let firstContainer = document.getElementsByClassName("exploreContainer")[0];
  firstContainer.className += " selected";

  centerMap(bb, bbox);

  let thisSchoolA = +bb[0].schida,
  thisSchoolB = +bb[0].schidb;

  // showLabels(thisSchoolA, thisSchoolB)

  showLabels(thisSchoolA, 84, 'labels-schools-a');
  showLabels(thisSchoolB, 85, 'labels-schools-b');


  showBoundary(thisSchoolA, thisSchoolB);

  container.on("click", function(event, d) {

    let bboxD = bbox.filter(function(o){

      return o.schida == d.schida && o.schidb == d.schidb
    })[0]

    let thisSchoolA = +d.schida,
    thisSchoolB = +d.schidb,
    thisSelected = document.getElementsByClassName("selected")[0];

    thisSelected.classList.remove("selected");

    selectedDiv = $(this)[0];

    selectedDiv.className += " selected";

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

    showLabels(thisSchoolA, 84, 'labels-schools-a');
    showLabels(thisSchoolB, 85, 'labels-schools-b');

    // showLabels(thisSchoolA, thisSchoolB);

    showBoundary(thisSchoolA, thisSchoolB);

    // setTimeout(function(){
    //
    //   var allVisible = map.queryRenderedFeatures({layers: ["sab-badbdy-dh08w0 (1)"] })
    //   var f1 = map.queryRenderedFeatures({layers: ["sab-badbdy-dh08w0 (1)"] }).filter(function(o){
    //     return +o.properties.schid == +d.schida || +o.properties.schid == +d.schidb
    //   })
    //
    //   for(var i = 0; i < allVisible.length; i++){
    //     map.setFeatureState(allVisible[i], { "active": false })
    //   }
    //
    //   for(var i = 0; i < f1.length; i++){
    //     map.setFeatureState(f1[i], { "active": true })
    //   }
    //
    // },timeOutLength)


  }) //on.click ends here


} // buildExploreList ends here


Promise.all([
  d3.csv("data/source/BB_ALL.csv"),
  d3.csv("data/source/badbdy.csv"),
]).then(function(allData) {
  // files[0] will contain file1.csv

  var bboxData = allData[0],
  bbData = allData[1]

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
      var msa  = ui.item.value;
      document.getElementById("thisMsa").innerHTML = msa;
      buildExploreList(bbData, bboxData, msa)
      document.getElementById("exploreList").scrollTo({top: 0, behavior: 'smooth'});
    }
  });

}).catch(function(err) {
  // handle error here
})
