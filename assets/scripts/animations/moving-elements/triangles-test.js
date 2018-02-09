import {TimelineMax} from 'gsap';
import {arrayUtility} from '../../utilities/array-utility';
import dat from 'dat-gui'; 

class MovingTriangles {

    constructor(options) {
        this.root = options.root;
        this.width = options.width;
        this.height = options.height;
        this.elements = options.elements;
        this.ctx = null,
        this.tl = new TimelineLite({
            onComplete:function() {
                setTimeout(() => { this.restart(); }, 500);
            }
        })
    }
    
    // create canvas
    createCanvas(){
        // create canvas
        let canvas = document.createElement("canvas");
        canvas.className = 'moving-triangles';
        canvas.width = this.width;
        canvas.height = this.height;
        this.root.appendChild(canvas);

        // create context
        let ctx = canvas.getContext("2d");

        return ctx;
    }

    removeTimeline(){
        this.tl.progress(0).pause().play(0).clear().kill(); 
    }

    removeCanvas(){
        this.root.querySelector('.moving-triangles').remove();
        this.ctx = null;
    }
    
    render(){
        // console.log( 'render');
        // return 'render';
    }

    // render start
    init() {
        this.ctx = this.createCanvas();
    }

    destroy(){
        this.removeTimeline();
        this.removeCanvas();
    }
    
}

let transformTriangle = function(elements, elementsOriginal, containerWidth, containerHeight){
    elements = [];
    elementsOriginal.forEach(function(item, index){
        elements[index] = {  polylines: [] }
         
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
            elements[index].polylines.push(item.polylines[i] - element.x.min + ( containerWidth - element.width ) / 2);
            elements[index].polylines.push(item.polylines[i+1] - element.y.min + ( containerHeight - element.height ) / 2);
        }
        
    });

    return elements;
}
let drawTriangle = function(ctx, x1, y1 , x2, y2, x3, y3){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    // ctx.fillStyle = "rgba(222,4,4," + (0.4*1 + Math.abs(Math.cos(x1/100)/4) + Math.abs(Math.sin(y1/100)/4) )  + ")";
    ctx.fillStyle = "rgba(222,4,4," + (0)  + ")";
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.fill();
}

export default function triangles(options) {
    // set options
    let self = {
        rootElement : options.root,
        width: options.root.offsetWidth || options.root.clientWidth,
        height: options.root.offsetHeight || options.root.clientHeight,
        settings: {
            animationTime: 2 || options.settings.animationTime,
            animationEase: 'elastic' || options.settings.animationEase,
            animationEaseX: 0.75 || options.settings.animationEaseX,
            animationEaseY: 0.2 || options.settings.animationEaseY,
        },
        datGUI: false || options.datGUI,
        elements: [],
        elementsOriginal: options.elementsOriginal,
    };

    let triangle;
    // создаём канвас с нужными настройками
    let init = function(){
        // console.log('init');
        // transform elements to center and scale
        self.elements = transformTriangle(self.elements, self.elementsOriginal, self.width, self.height);
        
        triangle = new MovingTriangles({
            root: self.rootElement,
            width: self.width,
            height: self.height,
            elements: self.elements
        });
        triangle.init();

        //========================================================================================


        // padding array triangles ( need arrays of the same length )
        triangle.elements.forEach(function(item){
            let voidValue = ( self.width + self.height ) / 4;
            item.polylines = arrayUtility.padArray(item.polylines,54*6,voidValue);
        });

        // set base state
        let state = [];
        triangle.elements[0].polylines.forEach(function(item, i, arr) {
            state.push(item);
        });

        // create a function to update render
        triangle.elements.forEach(function(item){
            item.polylines.onUpdate = function(){
                render(state);
            }
        });

        triangle.tl
        .to(state, self.settings.animationTime, triangle.elements[1].polylines) 
        .to(state, self.settings.animationTime, triangle.elements[0].polylines,  self.settings.animationTime + 0.5)

        // render current state
        function render(state){
            triangle.ctx.clearRect(0,0,self.width,self.height);
            // draw in reverse order to hide unused triangles
            for (let i = state.length; i >= 0; i -= 6) {
                drawTriangle(triangle.ctx, state[i],  state[i+1],  state[i+2],  state[i+3],  state[i+4], state[i+5]);
            }
        }

        // render start
        render(state);

       
    }

    // создаём канвас с нужными настройками
    let remove = function(){
        // console.log('remove');
        triangle.destroy();
    }

    let restart = function(){
        console.time('restart');
        remove();
        self.width = self.rootElement.offsetWidth || options.root.clientWidth;
        self.height = self.rootElement.offsetHeight ||  self.rootElement.clientHeight;
        init();
        console.timeEnd('restart');
        // console.log('restart');
    }

    if(self.datGUI){

        let gui = new dat.GUI();

        let controllerAnimationTime = gui.add(self.settings, 'animationTime', 0,5);
        let controllerAnimationEase = gui.add(self.settings, 'animationEase', [ 'elastic', 'linear', 'back', 'bounce' ]);
        let controllerAnimationEaseX = gui.add(self.settings, 'animationEaseX', 0,3).step(0.1);
        let controllerAnimationEaseY = gui.add(self.settings, 'animationEaseY', 0,3).step(0.1);

        controllerAnimationTime.onFinishChange(function() { 
            self.settings.controllerAnimationTime = value; 
            restart();
         });
        controllerAnimationEase.onChange(function(value) { 
            self.settings.animationEase = value; 
            restart();
        });
        controllerAnimationEaseX.onFinishChange(function(value) { 
            self.settings.animationEaseX = value; 
            restart();
        });
        controllerAnimationEaseY.onFinishChange(function(value) { 
            self.settings.animationEaseY = value; 
            restart();
        });

    }


    init();
    window.addEventListener('resize', function(event){ restart() });
    
}