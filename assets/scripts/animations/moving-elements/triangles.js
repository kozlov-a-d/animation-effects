import {TimelineMax} from 'gsap';
import {arrayUtility} from '../../utilities/array-utility';
import dat from 'dat-gui'; 

/*
размеры каждого элементы
длину каждого массива
*/

let drawTriangle = function(ctx, x1, y1 , x2, y2, x3, y3){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    // ctx.fillStyle = "rgba(222,4,4," + (0.6*1 + Math.random(9)/10)  + ")";
    // ctx.fillStyle = "rgba(222,4,4," + (0.4*1 + Math.abs(Math.cos(x1/100)/4) + Math.abs(Math.sin(y1/100)/4) )  + ")";
    ctx.fillStyle = "rgba(222,4,4," + (0)  + ")";
    // console.log(Math.abs(Math.sin(x1/100)/2))
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fill();
}

let transformTriangle = function(elements, containerWidth, containerHeight){
    elements.forEach(function(item){
        let element = {
            x: {
                min: containerWidth,
                max: 0,
            },
            y: {
                min: containerHeight,
                max: 0,
            },
            width: 0,
            height: 0
        }
        // check size each figures
        for( let i = 0; i < item.polylines.length; i += 2){
            element.x.min = (item.polylines[i] < element.x.min) ? item.polylines[i] : element.x.min;
            element.x.max = (item.polylines[i] > element.x.max) ? item.polylines[i] : element.x.max;
            element.y.min = (item.polylines[i+1] < element.y.min) ? item.polylines[i+1] : element.y.min;
            element.y.max = (item.polylines[i+1] > element.y.max) ? item.polylines[i+1] : element.y.max;
        }
        // calculate element size
        element.width = element.x.max - element.x.min;
        element.height = element.y.max - element.y.min;
        // calculate new position
        for( let i = 0; i < item.polylines.length; i += 2){
            item.polylines[i] = item.polylines[i] - element.x.min + ( containerWidth - element.width ) / 2;
            item.polylines[i+1] = item.polylines[i+1] - element.y.min + ( containerHeight - element.height ) / 2;
        }

    });
}

export default function triangles(options) {

    // set options
    let self = {
        rootElement : options.root,
        width: options.root.offsetWidth || options.root.clientWidth,
        height: options.root.offsetHeight || options.root.clientHeight,
        elements: options.elements,
        datGUI: false
    };



    // create canvas
    let canvas = document.createElement("canvas");
    canvas.width = self.width;
    canvas.height = self.height;
    self.rootElement.appendChild(canvas);

    // create context
    let ctx = canvas.getContext("2d");
    
    //========================================================================================

    // transform elements to center and scale
    transformTriangle(self.elements, self.width, self.height);
   
    // padding array triangles ( need arrays of the same length )
    self.elements.forEach(function(item){
        let voidValue = ( self.width + self.height ) / 4;
        item.polylines = arrayUtility.padArray(item.polylines,102*6,voidValue);
    });

    // set base state
    let state = [];
    self.elements[0].polylines.forEach(function(item, i, arr) {
        state.push(item);
    });

    //========================================================================================

    

    // create a function to update render
    self.elements.forEach(function(item){
        item.polylines.onUpdate = function(){
            render(state);
        }
    });


    let settings = {
        animationTime: 2,
        animationEase: 'elastic',
        animationEaseX: 0.75,
        animationEaseY: 0.2,
    }
    let gui = new dat.GUI();
    let controllerAnimationTime = gui.add(settings, 'animationTime', 0,5);
    let controllerAnimationEase = gui.add(settings, 'animationEase', [ 'elastic', 'linear', 'back', 'bounce' ]);
    let controllerAnimationEaseX = gui.add(settings, 'animationEaseX', 0,3).step(0.1);
    let controllerAnimationEaseY = gui.add(settings, 'animationEaseY', 0,3).step(0.1);

    controllerAnimationTime.onFinishChange(function() { restartTimeline(tl) });
    controllerAnimationEase.onChange(function(value) { 
        settings.animationEase = value; 
        changeEase(settings.animationEase, settings.animationEaseX, settings.animationEaseY );
        restartTimeline(tl);
    });
    controllerAnimationEaseX.onFinishChange(function(value) { 
        settings.animationEaseX = value; 
        changeEase(settings.animationEase, settings.animationEaseX, settings.animationEaseY )
        restartTimeline(tl);
     });
    controllerAnimationEaseY.onFinishChange(function(value) { 
        settings.animationEaseY = value; 
        changeEase(settings.animationEase, settings.animationEaseX, settings.animationEaseY );
        restartTimeline(tl);
    });

    // adding TimelineLite from GSAP
	let tl = new TimelineLite({onComplete:function() {
        setTimeout(() => {
            this.restart();
        }, 500);
    }});

    function restartTimeline(tl){
        console.log(settings);
        tl.progress(1).pause();  
        tl.play(0); 
        tl.clear();
        tl
            .to(state, settings.animationTime, self.elements[1].polylines) 
            .to(state, settings.animationTime, self.elements[0].polylines,  settings.animationTime + 0.5);
    }

    function changeEase(ease, x, y){
        switch(ease) {
            case 'elastic':
                self.elements.forEach(function(item){
                    item.polylines.ease = Elastic.easeOut.config(x, y);
                });
                break;
            
            case 'linear':
                self.elements.forEach(function(item){
                    item.polylines.ease = Power0.easeNone;
                });
                break;
            
            case 'back':
                self.elements.forEach(function(item){
                    item.polylines.ease = Back.easeOut.config(x);
                });
                break;

            case 'bounce':
                self.elements.forEach(function(item){
                    item.polylines.ease = Bounce.easeOut;
                });
                break;

            default:
                console.warn('nosearch ease');
        }

        
    }

    

    changeEase(settings.animationEase, 0.75, 0.2);
    

    tl
        .to(state, settings.animationTime, self.elements[1].polylines) 
        .to(state, settings.animationTime, self.elements[0].polylines,  settings.animationTime + 0.5)
    

    // render current state
    function render(state){
        ctx.clearRect(0,0,self.width,self.height);
        // draw in reverse order to hide unused triangles
		for (let i = state.length; i >= 0; i -= 6) {
			drawTriangle(ctx, state[i],  state[i+1],  state[i+2],  state[i+3],  state[i+4], state[i+5]);
        }
    }

    // render base state
    render(state);

}
