
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

// map.dragPan.disable();
// map.dragRotate.disable();
// map.keyboard.disable();
// map.scrollZoom.disable();


map.on('load', function() {
  // console.log(map.getStyle().layers)
  // var test = map.queryRenderedFeatures({ layers: ['labels-schools-a']});
  // var test2 = map.queryRenderedFeatures({ layers: ['boundaries']});
  // console.log(test2)
});

function showLabels(thisSchool, layerNumber, thisLayer) {

  var thisSchool = parseInt(thisSchool)

  let layerLabels = map.getStyle().layers[layerNumber].id,
  filtersLabels = ["all", ['in', 'schid', thisSchool]]
  map.setFilter(layerLabels, filtersLabels);
  map.setLayoutProperty(thisLayer, 'visibility', 'visible');

}

function showBoundary(thisSchoolA, thisSchoolB) {

  var thisSchoolA = parseInt(thisSchoolA),
  thisSchoolB = parseInt(thisSchoolB);

  let layerBoundaries = map.getStyle().layers[81].id,
  filterBoundaries = ["all", ['in', 'schida', thisSchoolA], ['in', 'schidb', thisSchoolB]]
  map.setFilter(layerBoundaries, filterBoundaries);
  map.setLayoutProperty('boundaries', 'visibility', 'visible');

  let layerCatchment = map.getStyle().layers[64].id,
  filterCatchment = ["all", ['in', 'schid', thisSchoolA, thisSchoolB]]
  map.setFilter(layerCatchment, filterCatchment);
  map.setLayoutProperty('catchments', 'visibility', 'visible');

}

function drawBars(bb) {
  var dataParsed = d3.groups(bb, function(d) {
    return d.borderid;
  }),
  dataLength = dataParsed.length;

  var containerGraphics = document.querySelector("#exploreList")

  containerGraphics.innerHTML = "";

  for(i = 0; i < dataLength; i++) {
    var data = dataParsed[i][1][0],
    withinLength = (dataParsed[i][1].length) - 1,
    blackPctA = data.pct_black_a + "%",
    blackPctB = data.pct_black_b + "%",
    hispPctA = data.pct_hisp_a + "%",
    hispPctB = data.pct_hisp_b + "%",
    whitePctA = data.pct_white_a + "%",
    whitePctB = data.pct_white_b + "%",
    otherPctA = data.pct_other_a + "%",
    otherPctB = data.pct_other_b + "%",
    schidA = data.schida,
    schidB = data.schidb,
    thisBoundary = i + 1;

    if(data.leabdy === 1) {
      var boundaryType = "district";
    } else {
      var boundaryType = "attendance";
    }


    var blockBoundary = "<div class=" + boundaryType + "><p class=number><span>" + thisBoundary + " </span>" + "of " + dataLength + " boundaries</p></div>"

    if(withinLength == 0 ) {
      var textOthers = "";
    } else if(withinLength == 1) {
      var textOthers = "<p class=otherSchools>Other pair of schools share <span class=underlineBoundaries>this boundary</span></p>";
    } else {
      var textOthers = "<p class=otherSchools>Other " + withinLength + " pair of schools share <span class=underlineBoundaries>this boundary</span></p>";
    }

    containerGraphics.innerHTML += "<div class=schoolContainer>" + blockBoundary + "<div class=schoolA id=" + schidA +  "> <p>" + data.schnamea + " and " + data.schnameb + "</p> <div class=graphicSchool> <div class=ticks><div class=tick0>0%</div> <div class=tick50>50%</div> <div class=tick100>100%</div></div> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctA + ";></div> <div class=hispPct style=width:"+ hispPctA + ";></div><div class=whitePct style=width:"+ whitePctA + ";></div> <div class=otherPct style=width:"+ otherPctA + ";></div> </div> </div> </div> <div class=schoolB id=" + schidB + "> <p>" + "</p> <div class=graphicSchool> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctB + ";></div> <div class=hispPct style=width:"+ hispPctB + ";></div><div class=whitePct style=width:"+ whitePctB + ";></div> <div class=otherPct style=width:"+ otherPctB + ";></div> </div> </div> </div>" + textOthers + "</div>"
  } // ends loop i
}


function centerMap(bbox, thisSchoolA, thisSchoolB) {

  let bboxD = bbox.filter(function(o){
    return o.schida == thisSchoolA && o.schidb == thisSchoolB
  })[0];

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
    });
  }

  // builds the list of cachments and adds piecharts

  function buildExploreList(bb, bbox, msa) {


    bb = bb.filter(function(o){ return o.maname == msa});

    var dataParsed = d3.groups(bb, function(d) {
      return d.borderid;
    })


  var data = [
  {month: new Date(2015, 0, 1), apples: 3840, bananas: 1920, cherries: 960, dates: 400},
  {month: new Date(2015, 1, 1), apples: 1600, bananas: 1440, cherries: 960, dates: 400},
  {month: new Date(2015, 2, 1), apples:  640, bananas:  960, cherries: 640, dates: 400},
  {month: new Date(2015, 3, 1), apples:  320, bananas:  480, cherries: 640, dates: 400}
];

var stack = d3.stack()
    .keys(["apples", "bananas", "cherries", "dates"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);


var thisTest = stack(data)


// console.log(thisTest)

    var margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 210 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;


    var svg = d3.select("#exploreList")
    .selectAll("smallCharts")
    .data(dataParsed)
    .enter()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g");


    svg.selectAll('rect')
    .data(function(d) {
      var whereData = d[1][0];
      console.log(whereData)
      var thisData = [
        {
          school: whereData.schnamea,
          orderSchool: 1,
          black: whereData.pct_black_a,
          hisp: whereData.pct_hisp_a,
          white: whereData.pct_white_a,
          other: whereData.pct_other_a
        },
        {
          school: whereData.schnameb,
          orderSchool: 2,
          black: whereData.pct_black_b,
          hisp: whereData.pct_hisp_b,
          white: whereData.pct_white_b,
          other: whereData.pct_other_a
        }
      ]
      console.log(thisData)
      return d;
    })

  } // buildExploreList ends here


  Promise.all([
    d3.csv("data/source/BB_ALL.csv"),
    d3.csv("data/source/badboundaries.csv"),
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
        buildExploreList(bbData, bboxData, msa);
      }
    });

  }).catch(function(err) {
    // handle error here
  })
