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
    ctx.fillStyle = "rgba(222,4,4," + (0.4*1 + Math.abs(Math.cos(x1/100)/4) + Math.abs(Math.sin(y1/100)/4) )  + ")";
    // console.log(Math.abs(Math.sin(x1/100)/2))
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
        ease: 'linear'
    }
    // let gui = new dat.GUI();
    // gui.add(settings, 'animationTime', 0,5);

    // adding TimelineLite from GSAP
	let tl = new TimelineLite({onComplete:function() {
        setTimeout(() => {
            this.restart();
        }, 1000);
    }});
// gui.add(cfg, 'springFactor', 0,0.5);

    self.elements.forEach(function(item){
        item.polylines.ease = Elastic.easeOut.config(0.75, 0.2);
    });
    
    document.addEventListener('click', function(){
        
    });

    tl
        .to(state, settings.animationTime, self.elements[1].polylines) 
        .to(state, settings.animationTime, self.elements[0].polylines,  settings.animationTime + 1)
    

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
