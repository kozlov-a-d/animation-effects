import {TimelineMax} from 'gsap';
import {arrayUtility} from '../../utilities/array-utility';

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

    ctx.fillStyle = "rgba(222,4,4," + (0.6*1 + Math.random(9)/10)  + ")";
    ctx.stroke();
    ctx.fill();
}

export default function triangles(options) {

    // set options
    let self = {
        rootElement : options.root,
        width: options.root.offsetWidth || options.root.clientWidth,
        height: options.root.offsetHeight || options.root.clientHeight,
        elements: options.elements
    };

    // create canvas 
    let canvas = document.createElement("canvas");
    canvas.className  = "myClass";
    canvas.width = self.width;
    canvas.height = self.height;
    self.rootElement.appendChild(canvas);

    // create context 
    let ctx = canvas.getContext("2d");
    
    // padding array triangles ( need arrays of the same length )
    self.elements.forEach(function(item){
        item.polylines = arrayUtility.padArray(item.polylines,102*6,300);
    });
    
    // set base state
    let state = [];
    self.elements[0].polylines.forEach(function(item, i, arr) {
        state.push(item); 
    });

    // adding TimelineLite from GSAP
	let tl = new TimelineLite({onComplete:function() {
        setTimeout(() => {
            this.restart();
        }, 1000);
    }});

    // create a function to update render
    self.elements.forEach(function(item){
        item.polylines.onUpdate = function(){
            render(state);
        }
    });

    // bind click for magic
    document.addEventListener('click', function(){
        
    })
    tl
        .to(state, 1, self.elements[1].polylines)
        .to(state, 1, self.elements[2].polylines, 2)
        .to(state, 1, self.elements[0].polylines, 4)
    
    // render current state
    function render(state){
        ctx.clearRect(0,0,self.width,self.height);
		for (var i = 0; i <= state.length; i = i +6) {
			drawTriangle(ctx, state[i],  state[i+1],  state[i+2],  state[i+3],  state[i+4], state[i+5]);
        }
    }

    // render base state
    render(state);

}
