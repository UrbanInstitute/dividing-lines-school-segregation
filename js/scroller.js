var widthDiv = (document.getElementById("scatter").offsetWidth),
widthWindow = window.innerWidth,
screenHeight = screen.height,
thisTop = document.getElementById("graphic").getBoundingClientRect().top + window.pageYOffset - 100,
thisBottom = document.getElementById("lastStep").getBoundingClientRect().bottom + window.pageYOffset - 400;


/**
* scroller - handles the details
* of figuring out which section
* the user is currently scrolled
* to.
*
*/

function scroller() {
  var container = d3.select('body');
  // event dispatcher
  var dispatch = d3.dispatch('active', 'progress');

  // d3 selection of all the
  // text sections that will
  // be scrolled through
  var sections = null;

  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  var sectionPositions = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;
  /**
  * scroll - constructor function.
  * Sets up scroller to monitor
  * scrolling of els selection.
  *
  * @param els - d3 selection of
  *  elements that will be scrolled
  *  through by user.
  */
  function scroll(els) {
    sections = els;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    d3.select(window)
    .on('scroll.scroller', position)
    .on('resize.scroller', resize);

    // manually call resize
    // initially to setup
    // scroller.
    resize();

    // hack to get position
    // to be called once for
    // the scroll position on
    // load.
    // @v4 timer no longer stops if you
    // return true at the end of the callback
    // function - so here we stop it explicitly.
    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  /**
  * resize - called initially and
  * also when page is resized.
  * Resets the sectionPositions
  *
  */
  function resize() {
    // sectionPositions will be each sections
    // starting position relative to the top
    // of the first section.
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top - 20;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
  }

  function fixVis() {

    if(window.pageYOffset > thisTop && window.pageYOffset < thisBottom) {
      d3.select("#chart")
      .classed("stickyChart", true)
      .classed("relativeTop", false)
      .classed("relativeBottom", false)

      d3.select("#lastStep")
      .classed("lastStepShort", false)
    } else if(window.pageYOffset < thisTop && window.pageYOffset < thisBottom - 30) {
      d3.select("#chart")
      .classed("stickyChart", false)
      .classed("relativeTop", true)
      .classed("relativeBottom", false)

      d3.select(".lastStep")
      .classed("lastStepShort", false)
    } else if(window.pageYOffset > thisTop && window.pageYOffset > thisBottom - 15) {
      d3.select("#chart")
      .classed("stickyChart", false)
      .classed("relativeTop", false)
      .classed("relativeBottom", true)

      var stickyChart = document.getElementsByClassName("relativeBottom")

      if(widthWindow > 350 && widthWindow < 500 && screenHeight > 750) {

        stickyChart[0].style.bottom = "20px";

      } else if(widthWindow > 350 && widthWindow < 500 && screenHeight < 750) {

        stickyChart[0].style.bottom = "50px";

      } else if(widthWindow < 350 && screenHeight < 600) {

        stickyChart[0].style.bottom = "125px";

      } else {

      }

      d3.select("#lastStep")
      .classed("lastStepShort", true)
    }
  }
  window.setInterval(function(){
    fixVis()
    // visPosition()
  }, 20);

  /**
  * position - get current users position.
  * if user has scrolled to new section,
  * dispatch active event with new section
  * index.
  *
  */
  function position() {
    var pos = window.pageYOffset - 150 - containerStart;

    var sectionIndex = d3.bisect(sectionPositions, pos);
    fixVis()
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      // @v4 you now `.call` the dispatch callback
      dispatch.call('active', this, sectionIndex);
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    // @v4 you now `.call` the dispatch callback
    dispatch.call('progress', this, currentIndex, progress);
  }

  /**
  * container - get/set the parent element
  * of the sections. Useful for if the
  * scrolling doesn't start at the very top
  * of the page.
  *
  * @param value - the new container value
  */
  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  // @v4 There is now no d3.rebind, so this implements
  // a .on method to pass in a callback to the dispatcher.
  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}

scroller()
