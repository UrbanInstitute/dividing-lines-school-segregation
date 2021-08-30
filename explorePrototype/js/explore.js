let msa = "Atlanta-Sandy Springs-Marietta, GA";

var widthWindow = window.innerWidth;

// defines map
mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let mapTool = new mapboxgl.Map({
  container: 'theMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckrasiw7s3ipt17pf3m3mbb4z/draft", // style URL
  center: [-84.331,33.858], // starting position [lng, lat]
  zoom: 11, // starting zoom
  maxZoom: 15,
  minZoom: 9,
  interactive: true

});

  mapTool.dragRotate.disable();
  mapTool.keyboard.disable();
  mapTool.scrollZoom.disable();
  mapTool.touchZoomRotate.disable();
  var control = mapTool.addControl(new mapboxgl.NavigationControl({
    showCompass: false
  }));

  if(widthWindow < 1170) {
    mapTool.dragPan.disable()
  }



mapTool.on('load', function() {
    // mapTool.resize();
  // console.log(mapTool.getStyle().layers)
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

  var dataLength = dataParsed.length;

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
      var boundaryType = "accrossTwo";
    } else {
      var boundaryType = "withinOne";
    }

    var blockBoundary = "<div class=" + boundaryType + "><p class=number><span>" + thisBoundary + " </span>" + "of " + dataLength + " boundaries</p></div>"

    if(withinLength == 0 ) {
      var textOthers = "";
    } else if(withinLength == 1) {
      var textOthers = "<p class=moreSchools>Another two schools share <span class=underlineBoundaries>this boundary</span></p>";
    } else {
      var textOthers = "<p class=moreSchools>Another " + withinLength + " pairs of schools share <span class=underlineBoundaries>this boundary</span></p>";
    }

    var moreShools = values.length;

    if(moreShools > 1) {

      for(p = 1; p < moreShools; p++) {
        var thisData = values[p];
        var schoolA = thisData.schnamea;
        var schoolB = thisData.schnameb;
        var bothSchools = "<span class=material-icons-outlined>school</span> " + schoolA + " and <span class=material-icons-outlined>school</span> " + schoolB;
        allTheSchools.push(bothSchools);


        var finalSchools = allTheSchools.join(' | ')
      }
    } else {
    }

    containerGraphics.innerHTML += "<div class=schoolContainer>" + blockBoundary + "<div class=schoolA id=" + schidA +  "> <p>" + data.schnamea + " and " + data.schnameb + "</p> <div class=graphicSchool> <div class=ticks><div class=tick0>0%</div> <div class=tick50>50%</div> <div class=tick100>100%</div></div> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctA + ";></div> <div class=hispPct style=width:"+ hispPctA + ";></div><div class=whitePct style=width:"+ whitePctA + ";></div> <div class=otherPct style=width:"+ otherPctA + ";></div> </div> </div> </div> <div class=schoolB id=" + schidB + "> <p>" + "</p> <div class=graphicSchool> <div class=marks><div class=mark0></div> <div class=mark50></div> <div class=mark100></div></div> <div class=barchart> <div class=blackPct style=width:" + blackPctB + ";></div> <div class=hispPct style=width:"+ hispPctB + ";></div><div class=whitePct style=width:"+ whitePctB + ";></div> <div class=otherPct style=width:"+ otherPctB + ";></div> </div> </div> </div>" + textOthers + "</div>";

    if(widthWindow > 770) {

      document.getElementsByClassName("schoolContainer")[i].setAttribute("data-schools", finalSchools)

      if(i === 0) {
        var theOtherSchools = document.getElementsByClassName("schoolContainer")[i].getAttribute("data-schools");
        if(theOtherSchools !== "") {
          document.getElementById("otherSchools").innerHTML = "<p><span>Other pairs of schools that share this boundary:</span> " + theOtherSchools + "</p>"
        } else {
          document.getElementById("otherSchools").innerHTML = "";
        }
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
      "essential": true // If true , then the animation is considered essential and will not be affected by prefers-reduced-motion .
      // "minZoom": 9
      // "maxZoom": 15
      // "minZoom": 13
    });

    var zoom = mapTool.getZoom();
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

    drawBars(bb)

    mapTool.on('load', function() {
      centerMap(bbox, thisSchoolA, thisSchoolB)
      showBoundary(thisSchoolA, thisSchoolB)

      showLabels(thisSchoolA, 79, 'labels-schools-a')

      showLabels(thisSchoolB, 80, 'labels-schools-b')
    });

    centerMap(bbox, thisSchoolA, thisSchoolB)

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

        if(widthWindow > 770) {

          var theOtherSchools = this.getAttribute("data-schools");

          if(theOtherSchools !== "") {
            document.getElementById("otherSchools").innerHTML = "<p><span>Other pairs of schools that share this boundary:</span> " + theOtherSchools + "</p>"
          } else {
            document.getElementById("otherSchools").innerHTML = "";
          }
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

        var msaList = bbData.map(function(o){
          return o.maname
          })

          // uniq() found here https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
          function uniq(a) {
              return a.filter(function(item, pos, ary) {
                  return !pos || item != ary[pos - 1];
              });
          }

          var uniqueMetros = uniq(msaList);

          setTimeout(function() {
            buildExploreList(bbData, bboxData, msa)
          }, 250)

          var windowWidth = window.innerWidth;

          if(windowWidth > 770) {
            var thisMenu = "#exploreAutocomplete"
          } else {
            var thisMenu = "#exploreAutocompleteMobile"
          }

          $(thisMenu).autocomplete({

            source: uniqueMetros,
            select: function(event, ui) {
              var msa  = ui.item.value;
              document.getElementById("thisMsa").innerHTML = msa;
              buildExploreList(bbData, bboxData, msa);
              document.getElementById("exploreList").scrollTop = 0;
              document.getElementById("exploreList").scrollLeft = 0;
              this.value = "";
              return false;
            }
          });
    })
