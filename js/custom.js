/* smooth scroll
----------------------------------------------*/
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });

/* scrollspy 
----------------------------------------------*/
$('body').scrollspy({ target: '#navbar-scroll' })

// Closes the Responsive Menu on Menu Item Click (but not dropdown toggles)
$('.navbar-collapse ul li a').click(function(e) {
    if ($(this).hasClass('dropdown-toggle')) return;
    $('.navbar-toggle:visible').click();
});

/* carousel 
----------------------------------------------*/
$(document).ready(function() {

  $("#screenshots").owlCarousel({
    items: 4,
    itemsCustom: [
      [0, 1],
      [480, 2],
      [768, 3],
      [992, 4]
    ]
  });

  $("#owl-clients").owlCarousel({
    navigation: false,
    slideSpeed: 300,
    autoHeight: true,
    singleItem: true
  });

  // ✅ NEW: Industry Partners carousel
  $("#owl-clientsIndustry").owlCarousel({
    navigation: false,
    slideSpeed: 300,
    autoHeight: true,
    singleItem: true
  });

});



/* sticky navigation + hide on down scroll / show on up scroll
----------------------------------------------*/
$(document).ready(function () {

  // Keep sticky behavior
  $("#menu").sticky({ topSpacing: 0 });

  var lastScrollTop = 0;
  var delta = 8;              // small tolerance (px)
  var navbarHeight = $("#menu").outerHeight();

  $(window).on("scroll", function () {
    var st = $(this).scrollTop();

    // ignore tiny scroll moves
    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > navbarHeight) {
      // scrolling DOWN -> hide menu
      $("#menu").stop(true, true).slideUp(200);
    } else {
      // scrolling UP -> show menu
      $("#menu").stop(true, true).slideDown(200);
    }

    lastScrollTop = st;
  });

});

	 
/* detect touch 
----------------------------------------------*/
if("ontouchstart" in window){
    document.documentElement.className = document.documentElement.className + " touch";
}
if(!$("html").hasClass("touch")){
    /* background fix */
    $(".parallax").css("background-attachment", "fixed");
}

/* fix vertical when not overflow
call fullscreenFix() if .fullscreen content changes */
function fullscreenFix(){
    var h = $('body').height();
    // set .fullscreen height
    $(".content-b").each(function(i){
        if($(this).innerHeight() <= h){
            $(this).closest(".fullscreen").addClass("not-overflow");
        }
    });
}
$(window).resize(fullscreenFix);
fullscreenFix();

/* resize background images 
----------------------------------------------*/
function backgroundResize(){
    var windowH = $(window).height();
    $(".landing, .action, .contact, .subscribe").each(function(i){
        var path = $(this);
        // variables
        var contW = path.width();
        var contH = path.height();
        var imgW = path.attr("data-img-width");
        var imgH = path.attr("data-img-height");
        var ratio = imgW / imgH;
        // overflowing difference
        var diff = parseFloat(path.attr("data-diff"));
        diff = diff ? diff : 0;
        // remaining height to have fullscreen image only on parallax
        var remainingH = 0;
        if(path.hasClass("parallax") && !$("html").hasClass("touch")){
            var maxH = contH > windowH ? contH : windowH;
            remainingH = windowH - contH;
        }
        // set img values depending on cont
        imgH = contH + remainingH + diff;
        imgW = imgH * ratio;
        // fix when too large
        if(contW > imgW){
            imgW = contW;
            imgH = imgW / ratio;
        }
        //
        path.data("resized-imgW", imgW);
        path.data("resized-imgH", imgH);
        path.css("background-size", imgW + "px " + imgH + "px");
    });
}
$(window).resize(backgroundResize);
$(window).focus(backgroundResize);
backgroundResize();

/* set parallax background-position 
----------------------------------------------*/
function parallaxPosition(e){
    var heightWindow = $(window).height();
    var topWindow = $(window).scrollTop();
    var bottomWindow = topWindow + heightWindow;
    var currentWindow = (topWindow + bottomWindow) / 2;
    $(".parallax").each(function(i){
        var path = $(this);
        var height = path.height();
        var top = path.offset().top;
        var bottom = top + height;
        // only when in range
        if(bottomWindow > top && topWindow < bottom){
            var imgW = path.data("resized-imgW");
            var imgH = path.data("resized-imgH");
            // min when image touch top of window
            var min = 0;
            // max when image touch bottom of window
            var max = - imgH + heightWindow;
            // overflow changes parallax
            var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
            top = top - overflowH;
            bottom = bottom + overflowH;
            // value with linear interpolation
            var value = min + (max - min) * (currentWindow - top) / (bottom - top);
            // set background-position
            var orizontalPosition = path.attr("data-oriz-pos");
            orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
            $(this).css("background-position", orizontalPosition + " " + value + "px");
        }
    });
}
if(!$("html").hasClass("touch")){
    $(window).resize(parallaxPosition);
    //$(window).focus(parallaxPosition);
    $(window).scroll(parallaxPosition);
    parallaxPosition();
}
