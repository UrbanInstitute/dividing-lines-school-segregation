
/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/
var scrollVis = function () {


  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
  * chart
  *
  * @param selection - the current d3 selection(s)
  *  to draw the visualization in. For this
  *  example, we will be drawing it in #vis
  */

  var chart = function (selection) {
    selection.each(function (rawData) {

      setupSections(rawData);


    });
  };

  // chart ends here


  var setupSections = function (rawData) {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = setMap;
    activateFunctions[1] = addDots;
    activateFunctions[2] = newBoundaries;
    activateFunctions[3] = theWorm;
    activateFunctions[4] = blocksMap;
    activateFunctions[5] = function() { scatter(rawData) };

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 6; i++) {
      updateFunctions[i] = function () {};
    }
  };

  /**
  * ACTIVATE FUNCTIONS
  *
  * These will be called their
  * section is scrolled to.
  *
  * General pattern is to ensure
  * all content for the current section
  * is transitioned in, while hiding
  * the content for the previous section
  * as well as the next section (as the
    * user may be scrolling up or down).
    *
    */

        /**
        * activate -
        *
        * @param index - index of the activated section
        */
        chart.activate = function (index) {
          activeIndex = index;
          var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
          var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
          scrolledSections.forEach(function (i) {
            activateFunctions[i]();
          });
          lastIndex = activeIndex;
        };

        /**
        * update
        *
        * @param index
        * @param progress
        */
        // chart.update = function (index, progress) {
        //   updateFunctions[index](progress);
        // };

        // return chart function
        console.log(chart)
        return chart;
      };
      //scrollvis ends here


      /**
      * display - called once data
      * has been loaded.
      * sets up the scroller and
      * displays the visualization.
      *
      * @param data - loaded tsv data
      */
      function display(rawData) {

        // create a new plot and
        // display it
        var plot = scrollVis();
        console.log(plot)
        d3.select('#chart')
        .datum(rawData)
        .call(plot);

        // setup scroll functionality
        var scroll = scroller()
        .container(d3.select('#graphic'));

        // pass in .step selection as the steps
        scroll(d3.selectAll('.step'));

        // setup event handling
        scroll.on('active', function (index) {

          console.log(index)

          // highlight current step text
          d3.selectAll('.step')
          .style('opacity', function (d, i) {
             return i === index ? 1 : 0.1; });

          // activate current section
          plot.activate(index);
        });
      }

      // load data and display
      d3.csv("data/source/ashfordlewis_blocks.csv", function(data) {
        display(data)
      });
