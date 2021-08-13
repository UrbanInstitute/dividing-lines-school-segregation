
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
      console.log("HOLA", top)
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
    console.log("ADIOS", containerStart)
  }

  function fixVis() {

    var thisTop = document.getElementById("graphic").getBoundingClientRect().top + window.scrollY - 10;
    var thisBottom = document.getElementById("lastStep").getBoundingClientRect().bottom + window.scrollY -400;

    if(window.scrollY > thisTop && window.scrollY < thisBottom) {
      d3.select("#chart")
        .classed("stickyChart", true)
        .classed("relativeTop", false)
        .classed("relativeBottom", false)

      d3.select("#lastStep")
        .classed("lastStepShort", false)
    } else if(window.scrollY < thisTop && window.scrollY < thisBottom) {
      d3.select("#chart")
        .classed("stickyChart", false)
        .classed("relativeTop", true)
        .classed("relativeBottom", false)

      d3.select(".lastStep")
        .classed("lastStepShort", false)
    } else if(window.scrollY > thisTop && window.scrollY > thisBottom) {
      d3.select("#chart")
        .classed("stickyChart", false)
        .classed("relativeTop", false)
        .classed("relativeBottom", true)

      d3.select("#lastStep")
        .classed("lastStepShort", true)
    }

    // var thisTop = document.getElementById("graphic").getBoundingClientRect().top + window.scrollY;

    // if(true){
    //   if(d3.select(".step").node().getBoundingClientRect().top <= 64){
    //     if(d3.selectAll(".step").nodes()[d3.selectAll(".step").nodes().length-1].getBoundingClientRect().bottom <= 600+200+20){
    //       d3.select("#chart")
    //         .classed("posRelBottomSingleCol", false)
    //         .classed("posRelTopSingleCol", false)
    //         .classed("posRelBottom", true)
    //         .classed("posRelTop", false)
    //         .classed("posFixed", false)
    //         .style("top", thisTop + 60 + "px")
    //       d3.select("#sections")
    //         .style("z-index",90)
    //     }else{
    //       d3.select("#chart")
    //         .classed("posRelBottomSingleCol", false)
    //         .classed("posRelTopSingleCol", false)
    //         .classed("posRelBottom", false)
    //         .classed("posRelTop", false)
    //         .classed("posFixed", true)
    //         .style("top", "20px")
    //       d3.select("#sections")
    //         .style("z-index",90)
    //
    //     }
    //   }else{
    //       d3.select("#chart")
    //         .classed("posRelBottomSingleCol", false)
    //         .classed("posRelTopSingleCol", false)
    //         .classed("posRelBottom", false)
    //         .classed("posRelTop", true)
    //         .classed("posFixed", false)
    //         .style("top", thisTop + 60 + "px")
    //       d3.select("#sections")
    //         .style("z-index",90)
    //   }
    // }
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
    var pos = window.pageYOffset - 10 - containerStart;
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
