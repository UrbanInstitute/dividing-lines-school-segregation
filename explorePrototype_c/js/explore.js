
let msa = "Abilene, TX";

// defines map
mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let map = new mapboxgl.Map({
  container: "exploreMap", // container ID
  style: "mapbox://styles/urbaninstitute/ckrasiw7s3ipt17pf3m3mbb4z/draft", // style URL
  center: [-84.331,33.858], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 13, // starting zoom
  interactive: true

});

// map.dragPan.disable();
// map.dragRotate.disable();
// map.keyboard.disable();
// map.scrollZoom.disable();


map.on("load", function() {
  console.log(map.getStyle().layers)
  // var test = map.queryRenderedFeatures({ layers: ["labels-schools-a"]});
  // var test2 = map.queryRenderedFeatures({ layers: ["boundaries"]});
  // console.log(test2)
});

function showLabels(thisSchool, layerNumber, thisLayer) {

  var thisSchool = parseInt(thisSchool)

  let layerLabels = map.getStyle().layers[layerNumber].id,
  filtersLabels = ["all", ["in", "schid", thisSchool]]
  map.setFilter(layerLabels, filtersLabels);
  map.setLayoutProperty(thisLayer, "visibility", "visible");

}

function showBoundary(thisSchoolA, thisSchoolB) {

  var thisSchoolA = parseInt(thisSchoolA),
  thisSchoolB = parseInt(thisSchoolB);

  let layerBoundaries = map.getStyle().layers[81].id,
  filterBoundaries = ["all", ["in", "schida", thisSchoolA], ["in", "schidb", thisSchoolB]]
  map.setFilter(layerBoundaries, filterBoundaries);
  map.setLayoutProperty("boundaries", "visibility", "visible");

  let layerCatchment = map.getStyle().layers[64].id,
  filterCatchment = ["all", ["in", "schid", thisSchoolA, thisSchoolB]]
  map.setFilter(layerCatchment, filterCatchment);
  map.setLayoutProperty("catchments", "visibility", "visible");

}

function drawBars(bb) {

  var dataParsed = d3.nest()
    .key(function(d) { return d.borderid; })
    .entries(bb)

  var margin = {top: 25, right: 0, bottom: 5, left: 70},
  width = 310 - margin.left - margin.right,
  height = 93 - margin.top - margin.bottom;

  var colorScale = d3.scaleOrdinal()
  .domain(["black", "hisp", "white", "other"])
  .range(["#fdbf11", "#ca5800", "#1696d2", "white"]);

  var xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

  var yScale = d3.scaleBand()
  .domain(["1", "2"])
  .range([ 0, height ])
  .padding(.1);

  var axis = d3.axisTop()
              .scale(xScale);

  function update(dataParsed) {

    var manyBoundaries = dataParsed.length;

    var list = d3.select("#exploreList")

    var div = list.selectAll("div")
    .data(function(d, i) {
      return dataParsed
    })

    div
      .join("div")
      .attr("class", "boundaries")
      .attr("id", function(d, i) {
        return d.key;
      })

    var boundaries = d3.selectAll(".boundaries")

    var ranking = boundaries.selectAll("p.number")
    .data(function(d, i) {
      var thisData = [{
        ranks: i + 1
      }]
      return thisData
    })

    ranking
      .join("p")
      .attr("class", "number")
      .html(function(d) {
        return "<span>" + d.ranks + " of " + manyBoundaries + " boundaries"
        // return "<p class=number><span>" + ranks + "</span> of xxx boundaries</p>"
      })

    var names = boundaries.selectAll("p.nameSchool")
      .data(function(d, i) {
        var thisData = [{
          schoolA: dataParsed[i].values[0].schnamea,
          schoolB: dataParsed[i].values[0].schnameb
        }]
        return thisData
      })

      names
        .join("p")
        .attr("class", "nameSchool")
        .html(function(d, i) {
          return d.schoolA + " and " + d.schoolB;
        })

    var svg = boundaries.selectAll("svg")
    .data([dataParsed])

    svg
      .join("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    var theSvg = d3.selectAll("svg")

    var scales = theSvg.selectAll("g.axis")

    scales
      .data([dataParsed])
      .join("g")
      .attr("class", "axis")
      .attr("transform", "translate(10, " + margin.top + ")")
      .call(axis
      .ticks(3));

    var gs = theSvg.selectAll("g.eachSchool")
      .data(function(d, i) {
        var whereData = d[i].values[0];
        var thisData = [
          {
            school: whereData.schnamea,
            orderSchool: "1",
            black: whereData.pct_black_a,
            hisp: whereData.pct_hisp_a,
            white: whereData.pct_white_a,
            other: whereData.pct_other_a
          },
          {
            school: whereData.schnameb,
            orderSchool: "2",
            black: whereData.pct_black_b,
            hisp: whereData.pct_hisp_b,
            white: whereData.pct_white_b,
            other: whereData.pct_other_b
          }
        ]
        return thisData
      })

      gs.join("g")
        .attr("transform", function(d, i) {

          return "translate(10," + ((i * 12) + margin.top) + ")"

        })
        .attr("id", function(d) {
          return d.school
        })
        .attr("class", "eachSchool")

      var theGs = d3.selectAll("g.eachSchool");

      var bars = theGs.selectAll("rect")
        .data(function(d, i) {

          var c = [d];

          var stackGen = d3.stack()
          .keys(["black", "hisp", "white", "other"]);

          var stackedData = stackGen(c);

          return(stackedData)
        })

        bars.join("rect")
          .attr("y", function(d, i) {
            return (+d[0].data.orderSchool -1 ) * 22
          })
          .attr("x", function(d) {
            return xScale(d[0][0])
          })
          .attr("width", function(d) {
            console.log(xScale(d[0][1]) - xScale(d[0][0]))
            return +(xScale(d[0][1]) - xScale(d[0][0]))
          })
          .attr("height", yScale.bandwidth())
          .attr("fill", function(d) {
            return colorScale(d.index)
          })

          var otherSchools = boundaries.selectAll("p.otherSchools")
          .data(function(d, i) {

            console.log(d)

            var theSchools = [{
              numberOfSchools: d.values.length
            }]
            return theSchools
          })

          otherSchools
            .join("p")
            .attr("class", "otherSchools")
            .html(function(d) {
              console.log(d.numberOfSchools)
              if(d.numberOfSchools == 2) {
                return "Another pair of schools share <span class=underlineBoundaries>this boundary</span>"
              } else if(d.numberOfSchools > 2) {
                return "Other " + d.numberOfSchools + " pair of schools share <span class=underlineBoundaries>this boundary</span>"
              } else {

              }
            })
        }
        // update ends here

        update(dataParsed)
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
            "minZoom": 0 // don"t hit the minZoom 6 ceiling for the map, so for large distances the flyTo arc isn"t truncated
          });
        }

        // builds the list of cachments and adds piecharts

        function buildExploreList(bb, bbox, msa) {

          bb = bb.filter(function(o){ return o.maname == msa});

          drawBars(bb)

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
