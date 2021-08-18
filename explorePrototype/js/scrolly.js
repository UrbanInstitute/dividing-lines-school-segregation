

mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";

let map = new mapboxgl.Map({
  container: 'exploreMap', // container ID
  style: "mapbox://styles/urbaninstitute/ckqv6bmld0mu917qsfxupq41d/draft", // style URL
  center: [-84.319,33.855], // starting position ([lng, lat] for Mombasa, Kenya)
  zoom: 12.35, // starting zoom
  interactive: false

});

map.on('load',function(){
map.resize()
})

function hasClass(element, className) {

  return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

function setStyles(thisLayer, thisStyle, setTo, transitionStyle, thisDuration) {

    map.setPaintProperty(thisLayer, thisStyle, setTo);

    map.getLayer(thisLayer).setPaintProperty(transitionStyle, {duration: thisDuration, delay: 0})

}

function setMap() {


  document.getElementById("exploreMap").style.display = "block";
  document.getElementById("scatter").style.display = "none";

  map.resize()

    let layerLabels = map.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School']]
    map.setFilter(layerLabels, filtersLabels);

    setStyles("ashfordlewis-old-sab", 'line-opacity', 1, 'line-opacity-transition', 1000)

    setStyles("scrollyschools-labels", 'text-opacity', 1, 'text-opacity-transition', 2000)

    setStyles("scrollyschools-labels", 'icon-opacity', 1, 'icon-opacity-transition', 2000)

    if(map.queryRenderedFeatures({ layers: ['dots-black-hispanic']}).length !== 0) {

      setStyles("dots-black-hispanic", 'circle-radius', 0, 'circle-radius-transition', 1000);
      setStyles("dots-others", 'circle-radius', 0, 'circle-radius-transition', 1000);

    }


}

function addDots() {

    map.resize()

    setStyles("dots-black-hispanic", 'circle-radius', 1.5, 'circle-radius-transition', 1000)
    setStyles("dots-others", 'circle-radius', 1.5, 'circle-radius-transition', 2000)


    if(map.queryRenderedFeatures({ layers: ['ashfordlewis-new-sab']})[0].layer.paint["line-opacity"] !== 0) {

      setStyles("ashfordlewis-new-sab", 'line-opacity', 0, 'line-opacity-transition', 1000)
      setStyles("ashfordlewis-old-sab", 'line-opacity', 1, 'line-opacity-transition', 2000)

      let layerLabels = map.getStyle().layers[82].id,
      filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School']]
      map.setFilter(layerLabels, filtersLabels);

      // map.getLayer("ashfordlewis-old-sab").setPaintProperty('line-opacity-transition', {duration: 2000, delay: 0})
      //
      // map.getLayer("ashfordlewis-new-sab").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})
    }

}

function newBoundaries() {

    map.setPaintProperty("ashfordlewis-old-sab", 'line-opacity', 0);
    map.setPaintProperty("ashfordlewis-new-sab", 'line-opacity', 1);

    let layerLabels = map.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
    map.setFilter(layerLabels, filtersLabels);

    map.getLayer("ashfordlewis-old-sab").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})

    map.getLayer("ashfordlewis-new-sab").setPaintProperty('line-opacity-transition', {duration: 2000, delay: 0})

    if(map.queryRenderedFeatures({ layers: ['ashfordlewis-new-worm']})[0].layer.paint["line-opacity"] !== 0) {
      let layerLabels = map.getStyle().layers[82].id,
      filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
      map.setFilter(layerLabels, filtersLabels);

      let layerSab = map.getStyle().layers[79].id,
      filtersSab = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'Montclair Elementary School', 'Woodward Elementary School', 'John Robert Lewis Elementary School']]
      map.setFilter(layerSab, filtersSab);

      setStyles("ashfordlewis-new-worm", 'line-opacity', 0, 'line-opacity-transition', 1000)
    }

    if(map.queryRenderedFeatures({ layers: ['blocks_choropleth']})[0].layer.paint["fill-opacity"]!== 0) {

        setStyles("blocks_choropleth", 'fill-opacity', 0, 'fill-opacity-transition', 2000)

    }
}

function theWorm() {

    map.resize()

    let layerSab = map.getStyle().layers[79].id,
    filtersSab = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'John Robert Lewis Elementary School']]
    map.setFilter(layerSab, filtersSab);

    let layerLabels = map.getStyle().layers[82].id,
    filtersLabels = ["all", ['in', 'schname', 'Ashford Park Elementary School', 'John Robert Lewis Elementary School']]
    map.setFilter(layerLabels, filtersLabels);

    map.setPaintProperty("ashfordlewis-new-worm", 'line-opacity', 1);
    map.getLayer("ashfordlewis-new-worm").setPaintProperty('line-opacity-transition', {duration: 1000, delay: 0})

    if(map.queryRenderedFeatures({ layers: ['blocks_choropleth']})[0].layer.paint["fill-opacity"]!== 0) {

        setStyles("blocks_choropleth", 'fill-opacity', 0, 'fill-opacity-transition', 100)

    }

}

function blocksMap() {

  map.on('load',function(){
    map.resize()
  })

  var isOut = hasClass(document.getElementById("exploreMap"), "transitionOut")

  if(isOut === true) {

    map.on('load',function(){
      map.resize()
    })

    document.getElementById("scatter").className = "transitionOut";
    document.getElementById("exploreMap").className = "mapboxgl-map transitionIn";

    setTimeout(transition, 0)

  } else {

    map.on('load',function(){
      map.resize()
    })

    document.getElementById("exploreMap").className = "mapboxgl-map";

    setTimeout(transition, 0)
  }

  function transition() {

    map.on('load',function(){
      map.resize()
    })

    document.getElementById("exploreMap").style.display = "block";
    document.getElementById("scatter").style.display = "none";

      setStyles("dots-black-hispanic", 'circle-radius', 0, 'circle-radius-transition', 1000)
      setStyles("dots-others", 'circle-radius', 0, 'circle-radius-transition', 1000)

      setStyles("blocks_choropleth", 'fill-opacity', 1, 'fill-opacity-transition', 2000)
  }
}


function scatter(data) {

  function transition() {
    document.getElementById("exploreMap").style.display = "none";
    document.getElementById("scatter").style.display = "block";
    document.getElementById("scatter").innerHTML = '';


        var colors = ["#fff3d1", "#fce39e", "#fdd870", "#fdbf11"]

        var widthWindow = (document.getElementById("scatter").offsetWidth),
        margin = {top: 25, right: 20, bottom: 70, left: 35},
        width = (widthWindow) - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom

        var svg = d3.select("#scatter")
          .append("svg")
            .attr("width", widthWindow)
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

  var isOut = hasClass(document.getElementById("exploreMap"), "transitionOut")

  if(isOut === false) {
    document.getElementById("exploreMap").className = "mapboxgl-map transitionOut";
    document.getElementById("scatter").className = "transitionIn";

    setTimeout(transition, 750)
  } else {
    setTimeout(transition, 0)
  }

}
