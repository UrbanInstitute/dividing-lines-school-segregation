
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
  // console.log(map.getStyle().layers)
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

  var margin = {top: 25, right: 20, bottom: 5, left: 0},
  width = 260 - margin.left - margin.right,
  height = 80 - margin.top - margin.bottom;

  var colorScale = d3.scaleOrdinal()
  .domain(["black", "hisp", "white", "other"])
  .range(["#fdbf11", "#ca5800", "#1696d2", "none"]);

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

    var div = list.selectAll("div.schoolContainer")
    .data(function(d, i) {
      return dataParsed
    })

    div
    .enter()
    .append("div")
    .merge(div)
    .attr("class", "schoolContainer")
    .attr("id", function(d, i) {
      return d.key;
    })

    div.exit()
    .remove();

    var boundaries = d3.selectAll(".schoolContainer")

    var ranking = boundaries.selectAll("div.bdy")
    .data(function(d, i) {

      if(+d.values[0].leabdy === 1) {
        var boundaryType = "accrossTwo";
      } else {
        var boundaryType = "withinOne";
      }

      var thisData = [{
        ranks: i + 1,
        typeOfBoundary: boundaryType
      }]
      return thisData
    })

    ranking
    .enter()
    .append("div")
    .merge(ranking)
    .attr("class", function(d) {
      return "bdy " + d.typeOfBoundary
    })
    .html(function(d) {
      return "<p><span>" + d.ranks + "</span> of " + manyBoundaries + " boundaries</p>"
    })

    ranking.exit()
    .remove()

    var names = boundaries.selectAll("p.nameSchool")
    .data(function(d, i) {
      var thisData = [{
        schoolA: dataParsed[i].values[0].schnamea,
        schoolB: dataParsed[i].values[0].schnameb
      }]
      return thisData
    })

    names
    .enter()
    .append("p")
    .merge(names)
    .attr("class", "nameSchool")
    .html(function(d, i) {
      return d.schoolA + " and " + d.schoolB;
    })

    names.exit()
    .remove()


    var svg = boundaries.selectAll("svg")
    .data([dataParsed])

    svg
    .enter()
    .append("svg")
    .merge(svg)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    svg.exit()
    .remove()

    var theSvg = d3.selectAll("svg")

    var scales = theSvg.selectAll("g.axis")
    .data([dataParsed])

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

      gs
      .enter()
      .append("g")
      .merge(gs)
      .attr("transform", function(d, i) {

        return "translate(5," + ((i * 12) + margin.top) + ")"

      })
      .attr("id", function(d) {
        return d.school
      })
      .attr("class", "eachSchool")

      gs.exit()
      .remove()

      var theGs = d3.selectAll("g.eachSchool");

      var bars = theGs.selectAll("rect")
      .data(function(d, i) {

        var c = [d];

        var stackGen = d3.stack()
        .keys(["black", "hisp", "white", "other"]);

        var stackedData = stackGen(c);

        return(stackedData)
      })

      bars
      .enter()
      .append("rect")
      .merge(bars)
      .attr("y", function(d, i) {
        return (+d[0].data.orderSchool -1 ) * 22
      })
      .attr("x", function(d) {
        return xScale(d[0][0])
      })
      .attr("width", function(d) {
        return +(xScale(d[0][1]) - xScale(d[0][0]))
      })
      .attr("height", yScale.bandwidth())
      .attr("fill", function(d) {
        return colorScale(d.index)
      })

      bars.exit()
      .remove()

      scales
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(5, " + margin.top + ")")
      .call(axis
        .ticks(3)
        .tickSize(-95))
      .call(function(scale) {
        scale.select(".domain").remove()
      })

      var otherSchools = boundaries.selectAll("p.otherSchools")
      .data(function(d, i) {

        var allTheSchools = [],
        finalSchools = ""

        for(i=1; i < d.values.length; i ++) {
          if(d.values.length > 1) {
          var thisData = d.values[i];
          var schoolA = thisData.schnamea;
          var schoolB = thisData.schnameb;
          var bothSchools = '&#x1F3EB' + " " + schoolA + " and " + '&#x1F3EB' + " " + schoolB;
          allTheSchools.push(bothSchools);

          var finalSchools = allTheSchools.join(' &#9658; ')

        } else {
          var finalSchools = ""
        }
      }

        var theSchools = [{
          numberOfSchools: d.values.length - 1,
          allTheSchools: finalSchools
        }]

        return theSchools
      })

      scales.select('.domain').remove()

      otherSchools
      .enter()
      .append("p")
      .merge(otherSchools)
      .attr("class", "otherSchools")
      .attr("data-schools", function(d) {
        return d.allTheSchools;
      })
      .html(function(d) {
        if(d.numberOfSchools == 1) {
          return "Another pair of schools share <span class=underlineBoundaries>this boundary</span>"
        } else if(d.numberOfSchools > 1) {
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
