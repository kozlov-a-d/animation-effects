import { throttle, debounce } from '../../lib/decorators';

const MAX_SKEW = 12;
const MIN_SKEW = 1;

let checkScrollSpeed = (function(settings){
    settings = settings || {};

    var lastPos, newPos, timer, delta, 
        delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

    function clear() {
      lastPos = null;
      delta = 0;
    }

    clear();

    return function(){
      newPos = window.scrollY;
      if ( lastPos != null ){ // && newPos < maxScroll 
        delta = newPos -  lastPos;
      }
      lastPos = newPos;
      clearTimeout(timer);
      timer = setTimeout(clear, delay);
      return delta;
    };
})();

let setSkew = throttle( function(skew ){
    let elems = document.querySelectorAll('.js-jelly-scroll');

    elems.forEach(function(item){
        item.style.transform = 'skewY('+ skew +'deg)'
    })
}, 16);

let setBack = debounce( function( ){
    let elems = document.querySelectorAll('.js-jelly-scroll');
    elems.forEach(function(item){
        item.style.transform = 'skewY('+ 0 +'deg)'
    })
}, 35);

export function initJelly (){
    window.onscroll = function(){
        let multiplier = 0.2;
        let currSpeed = checkScrollSpeed();

        if ( currSpeed >= MAX_SKEW) { currSpeed = MAX_SKEW }
        if ( currSpeed <= -MAX_SKEW) { currSpeed = -MAX_SKEW }
        if (-MIN_SKEW <= currSpeed && currSpeed <= MIN_SKEW) { currSpeed = 0 }

        let useSpeed = currSpeed * multiplier;

        setSkew(useSpeed);
        setBack();
    };
}