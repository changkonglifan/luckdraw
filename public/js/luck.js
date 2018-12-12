var luck = {

}
var speed = 100;
var show = 20;
var this_slider = $('.slider');
var cur_slide = 0;
var mousedowned = false;
var need_slide = 0;
var EasySlidesCanChange = true;
var slides ;
var count = 0;
var EasySlidesTimer;
var start = true; 
var cb ;
var sdj ;
var isReRender = false;//是否重新渲染
luck.init = function (callback,sdjObj) {
    this_slider = $('.slider');
    count = this_slider.children('*:not(.next_button, .prev_button, .nav_indicators)').length;
    slides = this_slider.children('*:not(.next_button, .prev_button, .nav_indicators)');
    cb = callback;
    sdj = sdjObj;
    if (this_slider.children('.nav_indicators').length > 0) {
        var nav_indicators = '<ul>';
        while (need_slide < count) {
            need_slide++;
            nav_indicators = nav_indicators + '<li>' + need_slide + '</li>';
        }
        nav_indicators = nav_indicators + '</ul>';
        this_slider.children('.nav_indicators').html(nav_indicators);
        need_slide = 0
    }
} 
luck.EasySlidesNext = function (nextslide) {
    count = this_slider.children('*:not(.next_button, .prev_button, .nav_indicators)').length;
    slides = this_slider.children('*:not(.next_button, .prev_button, .nav_indicators)');
    cur_slide = $('.active').index();
    var i = 0;
    cb.call(sdj);
    if (count > 0) {
        // if (typeof nextslide == 'number') {
        //     cur_slide = nextslide;
        // } else {
            cur_slide++;
            nextslide = cur_slide;
        // }
        while (cur_slide < 0) {
            cur_slide = cur_slide + count;
        }
        while (cur_slide >= count) {
            cur_slide = cur_slide - count;
        }
        while (nextslide < 0) {
            nextslide = nextslide + count;
        }
        while (nextslide >= count) {
            nextslide = nextslide - count;
        } 
        i = 0;
        /*
        $(this_slider).children('*:not(.next_button, .prev_button, .nav_indicators)').each(function() {
        */
        slides = this_slider.children('*:not(.next_button, .prev_button, .nav_indicators)');
        $(slides).each(function () {
            var cssclass = '';
            var icount = 0;
            icount = i - nextslide;
            while (icount < 0) {
                icount = icount + count;
            }
            while (icount > count) {
                icount = icount - count;
            }
            if (icount == 0) {
                cssclass = 'active';
                $(this_slider).find('.' + cssclass + ':not(.nav_indicators ul li)').removeClass(cssclass);
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
            } else if (icount < show / 2) {
                cssclass = 'next' + icount;
                $(this_slider).find('.' + cssclass).removeClass(cssclass);
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
            } else if (icount > count - (show / 2)) {
                cssclass = 'prev' + (count - icount);
                $(this_slider).find('.' + cssclass).removeClass(cssclass);
                $(this).removeClass('hidden');
                $(this).addClass(cssclass);
            } else {
                $(this).addClass('hidden');
            }
            i++;
        }); 
        clearTimeout(EasySlidesTimer);
        EasySlidesTimer = setTimeout(function () {
            if (start){
                luck.EasySlidesNext();
            } else if (!start && isReRender){
                sdj.getAfterPrize();
            }
        }, speed);
    } 
} 
luck.setStart = function (isStart, flg) {
    start = isStart;  
    isReRender = flg; 
}
/**
 * 设置速度
 */
luck.setSpeed = function (params) {
    speed = params;
}