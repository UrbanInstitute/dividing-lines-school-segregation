let msa = "Atlanta-Sandy Springs-Marietta, GA";

// defines map
mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let mapTool = new mapboxgl.Map({
  container: 'theMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckrasiw7s3ipt17pf3m3mbb4z/draft", // style URL
  center: [-84.331,33.858], // starting position [lng, lat]
  zoom: 13, // starting zoom
  interactive: true

});

// mapTool.dragPan.disable();
// mapTool.dragRotate.disable();
// mapTool.keyboard.disable();
  mapTool.scrollZoom.disable();


mapTool.on('load', function() {
    // mapTool.resize();
  console.log(mapTool.getStyle().layers)
  // var test = mapTool.queryRenderedFeatures({ layers: ['labels-schools-a']});
  // var test2 = mapTool.queryRenderedFeatures({ layers: ['boundaries']});
  // console.log(test2)
});

function showLabels(thisSchool, layerNumber, thisLayer) {

  var thisSchool = parseInt(thisSchool)

  let layerLabels = mapTool.getStyle().layers[layerNumber].id,
  filtersLabels = ["all", ['in', 'schid', thisSchool]]
  mapTool.setFilter(layerLabels, filtersLabels);
  mapTool.setLayoutProperty(thisLayer, 'visibility', 'visible');

}

function showBoundary(thisSchoolA, thisSchoolB) {

  var thisSchoolA = parseInt(thisSchoolA),
  thisSchoolB = parseInt(thisSchoolB);

  let layerBoundaries = mapTool.getStyle().layers[78].id,
  filterBoundaries = ["all", ['in', 'schida', thisSchoolA], ['in', 'schidb', thisSchoolB]]
  mapTool.setFilter(layerBoundaries, filterBoundaries);
  mapTool.setLayoutProperty('boundaries', 'visibility', 'visible');

  let layerCatchment = mapTool.getStyle().layers[63].id,
  filterCatchment = ["all", ['in', 'schid', thisSchoolA, thisSchoolB]]
  mapTool.setFilter(layerCatchment, filterCatchment);
  mapTool.setLayoutProperty('catchments', 'visibility', 'visible');

}

function drawBars(bb) {

  var dataParsed = d3.nest()
    .key(function(d) {
      return d.borderid
    })
    .entries(bb)

  dataLength = dataParsed.length;

  var containerGraphics = document.querySelector("#exploreList")

  containerGraphics.innerHTML = "";

  for(i = 0; i < dataLength; i++) {
    var values = dataParsed[i].values,
    data = values[0],
    withinLength = values.length -1,
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
    thisBoundary = i + 1,
    allTheSchools = [],
    finalSchools = "";

    if(data.leabdy == 1) {
      var boundaryType = "district";
    } else {
      var boundaryType = "attendance";
    }

    var blockBoundary = "<div class=" + boundaryType + "><p class=number><span>" + thisBoundary + " </span>" + "of " + dataLength + " boundaries</p></div>"

    if(withinLength == 0 ) {
      var textOthers = "";
    } else if(withinLength == 1) {
      var textOthers = "<p class=moreSchools>Other pair of schools share <span class=underlineBoundaries>this boundary</span></p>";
    } else {
      var textOthers = "<p class=moreSchools>Other " + withinLength + " pair of schools share <span class=underlineBoundaries>this boundary</span></p>";
    }

    var moreShools = values.length;

    if(moreShools > 1) {

      for(p = 1; p < moreShools; p++) {
        var thisData = values[p];
        var schoolA = thisData.schnamea;
        var schoolB = thisData.schnameb;
        var bothSchools = '&#x1F3EB' + " " + schoolA + " and " + '&#x1F3EB' + " " + schoolB;
        allTheSchools.push(bothSchools);

        var finalSchools = allTheSchools.join(' &#9658; ')
      }
    } else {
    }

    containerGraphics.innerHTML += "<div class=schoolContainer>" + blockBoundary + "<div class=schoolA id=" + schidA +  "> <p>" + data.schnamea + " and " + data.schnameb + "</p> <div class=graphicSchool> <div class=ticks><div class=tick0>0%</div> <div class=tick50>50%</div> <div class=tick100>100%</div></div> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctA + ";></div> <div class=hispPct style=width:"+ hispPctA + ";></div><div class=whitePct style=width:"+ whitePctA + ";></div> <div class=otherPct style=width:"+ otherPctA + ";></div> </div> </div> </div> <div class=schoolB id=" + schidB + "> <p>" + "</p> <div class=graphicSchool> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctB + ";></div> <div class=hispPct style=width:"+ hispPctB + ";></div><div class=whitePct style=width:"+ whitePctB + ";></div> <div class=otherPct style=width:"+ otherPctB + ";></div> </div> </div> </div>" + textOthers + "</div>";

    document.getElementsByClassName("schoolContainer")[i].setAttribute("data-schools", finalSchools)

    if(i === 0) {
      var theOtherSchools = document.getElementsByClassName("schoolContainer")[i].getAttribute("data-schools");
      if(theOtherSchools !== "") {
        document.getElementById("otherSchools").innerHTML = "<p><span>Other pair of schools schools that share this boundary:</span> " + theOtherSchools + "</p>"
      } else {
        document.getElementById("otherSchools").innerHTML = "";
      }
    }
  } // ends loop i
}


function centerMap(bbox, thisSchoolA, thisSchoolB) {

  let bboxD = bbox.filter(function(o){
    return o.schida == thisSchoolA && o.schidb == thisSchoolB
  })[0];

  mapTool.fitBounds(
    [
      [+bboxD.xmin, +bboxD.ymin], // southwestern corner of the bounds
      [+bboxD.xmax, +bboxD.ymax] // northeastern corner of the bounds
    ],
    {
      "padding": {"top": 0, "bottom":0, "left": 0, "right": 0}, // padding around district, a bit more on bottom to accomodate logo
      "duration": 1000,
      "linear": true,
      "essential": true, // If true , then the animation is considered essential and will not be affected by prefers-reduced-motion .
      "minZoom": 0 // don't hit the minZoom 6 ceiling for the map, so for large distances the flyTo arc isn't truncated
    });
  }

  // builds the list of cachments and adds piecharts

  function buildExploreList(bb, bbox, msa) {

    bb = bb.filter(function(o){ return o.maname == msa});

    if(msa === "Atlanta-Sandy Springs-Marietta, GA") {
      var thisSchoolA = bb[1].schida,
      thisSchoolB = bb[1].schidb;
    } else {
      var thisSchoolA = bb[0].schida,
      thisSchoolB = bb[0].schidb;
    }

    centerMap(bbox, thisSchoolA, thisSchoolB)

    drawBars(bb)

    showBoundary(thisSchoolA, thisSchoolB)

    showLabels(thisSchoolA, 79, 'labels-schools-a');
    showLabels(thisSchoolB, 80, 'labels-schools-b');

    var allContainers = document.querySelectorAll(".schoolContainer");

    if(msa === "Atlanta-Sandy Springs-Marietta, GA") {
      allContainers[1].className += " selected";
    } else {
      allContainers[0].className += " selected";
    }

    for(j = 0; j < allContainers.length; j++) {
      allContainers[j].addEventListener("click", function() {

        var theSelected = document.getElementsByClassName("selected")[0]
        theSelected.className = "schoolContainer";

        this.className += " selected";

        var theOtherSchools = this.getAttribute("data-schools");

        theOtherSchools.replace(/,(?=[^\s])/g, ", ");

        if(theOtherSchools !== "") {
          document.getElementById("otherSchools").innerHTML = "<p><span>Other pair of schools schools that share this boundary:</span> " + theOtherSchools + "</p>"
        } else {
          document.getElementById("otherSchools").innerHTML = "";
        }

        var schoolAId = this.querySelectorAll(".schoolA")[0].id,
        schoolBId = this.querySelectorAll(".schoolB")[0].id;

        centerMap(bbox, schoolAId, schoolBId)

        showBoundary(schoolAId, schoolBId)

        showLabels(schoolAId, 79, 'labels-schools-a');
        showLabels(schoolBId, 80, 'labels-schools-b');

      })
    } // ends loop j

  } // buildExploreList ends here

  d3.queue()
    .defer(d3.csv, "data/source/BB_ALL.csv")
    .defer(d3.csv, "data/source/badbdy.csv")
    .await(function(error, bboxData, bbData) {
      if(error) throw error;

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

          setTimeout(buildExploreList(bbData, bboxData, msa), 500)

          $("#exploreAutocomplete").autocomplete({
            source: uniqueMetros,
            select: function(event, ui) {
              var msa  = ui.item.value;
              document.getElementById("thisMsa").innerHTML = msa;
              buildExploreList(bbData, bboxData, msa);
            }
          });
    })
