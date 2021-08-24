var widthDiv = (document.getElementById("scatter").offsetWidth),
widthWindow = window.innerWidth,
screenHeight = screen.height;

if(widthDiv < 301 || screenHeight < 700) {
  var fullHeight = 500
} else if(widthDiv > 300 && widthWindow > 770 && widthWindow < 1100 && screenHeight > 1000) {
  var fullHeight = 700
} else {
  var fullHeight = 600
}

mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let mapScrolly = new mapboxgl.Map({
  container: 'scrollyMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckqv6bmld0mu917qsfxupq41d/draft", // style URL
  center: [-84.319,33.855], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 11, // starting zoom
  interactive: false

});

mapScrolly.on('load',function(){
mapScrolly.resize()
// var bounds = mapScrolly.getBounds(),
// swLat = bounds._sw.lat,
// swLng = bounds._sw.lng,
// neLat = bounds._ne.lat,
// neLng = bounds._ne.lng;
//
// console.log(bounds)

mapScrolly.fitBounds([[-84.35940483597442, 33.821439210685796], [-84.27859516402599, 33.888547607193985]]);
})

var mapCanvasLoad = document.getElementById("scrollyMap").getElementsByClassName("mapboxgl-canvas-container")[0].childNodes[0].offsetHeight;

// mapScrolly.on('idle', function() {
//   console.log(document.getElementById('scrollyMap').clientHeight)
//   mapScrolly.resize()
// })

function hasClass(element, className) {

  return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

function setStyles(thisLayer, thisStyle, setTo, transitionStyle, thisDuration) {

    mapScrolly.setPaintProperty(thisLayer, thisStyle, setTo);

    mapScrolly.getLayer(thisLayer).setPaintProperty(transitionStyle, {duration: thisDuration, delay: 0})

}

function setMap() {

  mapScrolly.resize()


  document.getElementById("scrollyMap").style.display = "block";
  document.getElementById("scatter").style.display = "none";

    let layerLabels = mapScrolly.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School']]
    mapScrolly.setFilter(layerLabels, filtersLabels);

    setStyles("ashfordlewis-old-sab", 'line-opacity', 1, 'line-opacity-transition', 1000)

    setStyles("scrollyschools-labels", 'text-opacity', 1, 'text-opacity-transition', 2000)

    setStyles("scrollyschools-labels", 'icon-opacity', 1, 'icon-opacity-transition', 2000)

    if(mapScrolly.queryRenderedFeatures({ layers: ['dots-black-hispanic']}).length !== 0) {

      setStyles("dots-black-hispanic", 'circle-radius', 0, 'circle-radius-transition', 1000);
      setStyles("dots-others", 'circle-radius', 0, 'circle-radius-transition', 1000);

    }


}

function addDots() {

    mapScrolly.resize()

    setStyles("dots-black-hispanic", 'circle-radius', 1.5, 'circle-radius-transition', 1000)
    setStyles("dots-others", 'circle-radius', 1.5, 'circle-radius-transition', 2000)


    if(mapScrolly.queryRenderedFeatures({ layers: ['ashfordlewis-new-sab']})[0].layer.paint["line-opacity"] !== 0) {

      setStyles("ashfordlewis-new-sab", 'line-opacity', 0, 'line-opacity-transition', 1000)
      setStyles("ashfordlewis-old-sab", 'line-opacity', 1, 'line-opacity-transition', 2000)

      let layerLabels = mapScrolly.getStyle().layers[82].id,
      filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School']]
      mapScrolly.setFilter(layerLabels, filtersLabels);

      // mapScrolly.getLayer("ashfordlewis-old-sab").setPaintProperty('line-opacity-transition', {duration: 2000, delay: 0})
      //
      // mapScrolly.getLayer("ashfordlewis-new-sab").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})
    }

}

function newBoundaries() {

    mapScrolly.resize()

    mapScrolly.setPaintProperty("ashfordlewis-old-sab", 'line-opacity', 0);
    mapScrolly.setPaintProperty("ashfordlewis-new-sab", 'line-opacity', 1);

    let layerLabels = mapScrolly.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
    mapScrolly.setFilter(layerLabels, filtersLabels);

    mapScrolly.getLayer("ashfordlewis-old-sab").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})

    mapScrolly.getLayer("ashfordlewis-new-sab").setPaintProperty('line-opacity-transition', {duration: 2000, delay: 0})

    if(mapScrolly.queryRenderedFeatures({ layers: ['ashfordlewis-new-worm']})[0].layer.paint["line-opacity"] !== 0) {
      let layerLabels = mapScrolly.getStyle().layers[82].id,
      filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
      mapScrolly.setFilter(layerLabels, filtersLabels);

      let layerSab = mapScrolly.getStyle().layers[79].id,
      filtersSab = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
      mapScrolly.setFilter(layerSab, filtersSab);

      setStyles("ashfordlewis-new-worm", 'line-opacity', 0, 'line-opacity-transition', 1000)
    }

    if(mapScrolly.queryRenderedFeatures({ layers: ['blocks_choropleth']})[0].layer.paint["fill-opacity"]!== 0) {

        setStyles("blocks_choropleth", 'fill-opacity', 0, 'fill-opacity-transition', 2000)

    }
}

function theWorm() {

    mapScrolly.resize()

    let layerSab = mapScrolly.getStyle().layers[79].id,
    filtersSab = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'John Robert Lewis Elementary School']]
    mapScrolly.setFilter(layerSab, filtersSab);

    let layerLabels = mapScrolly.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'John Robert Lewis Elementary School']]
    mapScrolly.setFilter(layerLabels, filtersLabels);

    mapScrolly.setPaintProperty("ashfordlewis-new-worm", 'line-opacity', 1);
    mapScrolly.getLayer("ashfordlewis-new-worm").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})

    if(mapScrolly.queryRenderedFeatures({ layers: ['blocks_choropleth']})[0].layer.paint["fill-opacity"]!== 0) {

        setStyles("blocks_choropleth", 'fill-opacity', 0, 'fill-opacity-transition', 100)

    }

}

function blocksMap() {

  // mapScrolly.on('load',function(){
  //   mapScrolly.resize()
  // })

  var isOut = hasClass(document.getElementById("scrollyMap"), "transitionOut")

  if(isOut === true) {

    document.getElementById("scatter").className = "transitionOut";
    document.getElementById("scrollyMap").className = "mapboxgl-map transitionIn";

    setTimeout(transition, 0)

  } else {

    // mapScrolly.on('load',function(){
    //   mapScrolly.resize()
    // })

    document.getElementById("scrollyMap").className = "mapboxgl-map";

    setTimeout(transition, 0)
  }

  function transition() {


    var mapCanvas = document.getElementById("scrollyMap").getElementsByClassName("mapboxgl-canvas-container")[0].childNodes[0];

    if(mapCanvas.offsetHeight < mapCanvasLoad) {

      document.getElementById("scatter").style.display = "none";
      document.getElementById("scrollyMap").style.visibility = "hidden";

      setTimeout(function() {
            document.getElementById("scrollyMap").style.display = "block";
            mapScrolly.resize()
            document.getElementById("scrollyMap").style.visibility = "visible";
      }, 150)


    } else {
      document.getElementById("scatter").style.display = "none";
      document.getElementById("scrollyMap").style.visibility = "hidden";
      document.getElementById("scrollyMap").style.display = "block";
      document.getElementById("scrollyMap").style.visibility = "visible";
    }



      setStyles("dots-black-hispanic", 'circle-radius', 0, 'circle-radius-transition', 1000)
      setStyles("dots-others", 'circle-radius', 0, 'circle-radius-transition', 1000)

      setStyles("blocks_choropleth", 'fill-opacity', 1, 'fill-opacity-transition', 2000)
  }
}


function scatter(data) {

  function transition() {
    document.getElementById("scrollyMap").style.display = "none";
    document.getElementById("scatter").style.display = "block";
    document.getElementById("scatter").innerHTML = '';


        var colors = ["#fff3d1", "#fce39e", "#fdd870", "#fdbf11"]

        var margin = {top: 25, right: 20, bottom: 70, left: 35},
        width = (widthDiv) - margin.left - margin.right,
        height = fullHeight - margin.top - margin.bottom

        var svg = d3.select("#scatter")
          .append("svg")
            .attr("width", widthDiv)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + " , " + margin.top + ")")

        var xScale = d3.scaleLinear()
          .domain([-1.5, 1.5])
          .range([0, width])

        var yScale = d3.scaleLinear()
          .domain(d3.extent(data, function(d) {
            return +d.BLACKHISP_PCT;
          }))
          .nice()
          .range([height, 0])

        var rScale = d3.scaleSqrt()
          .domain(d3.extent(data, function(d) {
            return +d.pop
          }))
          .range([1, 30])

        svg.append("g")
          .call(d3.axisLeft(yScale)
          .ticks(4)
          .tickSize(-width)
          .tickValues([0, 25, 50, 75, 100])
          .tickFormat(function(d) {
            return d + "%";
          }))
          .call(function(g) {
            g.select(".domain")
          .remove()
        })
          .call(function(g) {
            g.selectAll(".tick:not(:first-of-type) line")
            .attr("stroke", "#dedddd")
          })

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale)
          .ticks(7)
          .tickValues([-1.5, -1, -0.5, 0, 0.5, 1, 1.5]))

          var value0 = xScale(0) + 0.5,
          value79pct = yScale(79),
          value13pct = yScale(13)

          svg
            .append("line")
            .attr("id", "zero-line")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", value0)
            .attr("y1", 0)
            .attr("x2", value0)
            .attr("y2", height)

          svg
            .append("line")
            .attr("id", "79-line")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", value79pct)
            .attr("x2", value0)
            .attr("y2", value79pct)
            .style("stroke-dasharray", ("3, 3"))

          svg
            .append("line")
            .attr("id", "13-line")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", value0)
            .attr("y1", value13pct)
            .attr("x2", width)
            .attr("y2", value13pct)
            .style("stroke-dasharray", ("3, 3"))

        svg
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("r", 0)
          .attr("class", "bubble")
          .attr("id", function(d) {
            return d.gisjoin
          })
          .attr("cx", function(d) {
            return xScale((+d.dist) * -1)
          })
          .attr("cy", function(d) {
            return yScale(+d.BLACKHISP_PCT)
          })
          .style("fill", function(d) {
            if(+d.BLACKHISP_PCT < 25) {
              return colors[0]
            } else if(+d.BLACKHISP_PCT > 24 && +d.BLACKHISP_PCT < 50) {
              return colors[1]
            } else if(+d.BLACKHISP_PCT > 49 && +d.BLACKHISP_PCT < 75) {
              return colors[2]
            } else {
              return colors[3]
            }
          })
          .style("opacity", "0.6")
          .attr("stroke", "black")
          .transition()
          .duration(1200)
          .attr("r", function(d) {
            return rScale(+d.pop)
          })

          svg
          .append("text")
            .attr("class", "label-axis")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 10)
            .text("Distance to attendance boundary (kilometers)");

          svg
          .append("text")
            .attr("text-anchor", "start")
            .attr("class", "label-axis")
            .attr("x", -margin.left + 2)
            .attr("y", -14)
            .text("Black or Hispanic share")

          svg
          .append("text")
          .attr("tex-anchor", "start")
          .attr("class", "school-names")
          .attr("x", 0)
          .attr("y", (height / 2) -50)
          .text("John Lewis")

          svg
          .append("text")
          .attr("tex-anchor", "start")
          .attr("class", "school-names")
          .attr("x", 0)
          .attr("y", (height / 2) -30)
          .text("Elementary")

          svg
          .append("text")
          .attr("tex-anchor", "start")
          .attr("class", "school-names")
          .attr("x", width - 100)
          .attr("y", (height / 2) -50)
          .text("Ashford Park")

          svg
          .append("text")
          .attr("tex-anchor", "start")
          .attr("class", "school-names")
          .attr("x", width -100)
          .attr("y", (height / 2) -30)
          .text("Elementary")

         var legendBubbles = svg.selectAll("g.legend")
            .append('g')
            .attr("id", legendBubbles)
  }

  var isOut = hasClass(document.getElementById("scrollyMap"), "transitionOut")

  if(isOut === false) {
    document.getElementById("scrollyMap").className = "mapboxgl-map transitionOut";
    document.getElementById("scatter").className = "transitionIn";

    setTimeout(transition, 500)
  } else {
    setTimeout(transition, 0)
  }

}
