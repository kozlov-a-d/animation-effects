import {TimelineMax} from 'gsap';
import {arrayUtility} from '../../utilities/array-utility';
import dat from 'dat-gui'; 

/**************************************************************/
/*                    Support funtion                         */
/**************************************************************/
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

let restartTimeline = function(tl, animation, elements ){
    tl.progress(0).pause().play(0).clear();  
    
    animation(elements);
}

let changeEase = function(elements, ease, x, y){
    switch(ease) {
        case 'elastic':
                elements.forEach(function(item){
                item.polylines.ease = Elastic.easeOut.config(x, y);
            });
            break;
        
        case 'linear':
            elements.forEach(function(item){
                item.polylines.ease = Power0.easeNone;
            });
            break;
        
        case 'back':
            elements.forEach(function(item){
                item.polylines.ease = Back.easeOut.config(x);
            });
            break;

        case 'bounce':
            elements.forEach(function(item){
                item.polylines.ease = Bounce.easeOut;
            });
            break;

        default:
            console.warn('nosearch ease');
    }

    
}

/**************************************************************/
/*                           Main                             */
/**************************************************************/
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

    // create canvas
    let canvas = document.createElement("canvas");
    canvas.width = self.width;
    canvas.height = self.height;
    self.rootElement.appendChild(canvas);

    // create context
    let ctx = canvas.getContext("2d");
    
    //========================================================================================

    // transform elements to center and scale
    self.elements = transformTriangle(self.elements, self.elementsOriginal, self.width, self.height);
   
    // padding array triangles ( need arrays of the same length )
    self.elements.forEach(function(item){
        let voidValue = ( self.width + self.height ) / 4;
        item.polylines = arrayUtility.padArray(item.polylines,54*6,voidValue);
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

    // adding TimelineLite from GSAP
	let tl = new TimelineLite({
        onComplete:function() {
            setTimeout(() => { this.restart(); }, 500);
        }
    });

    // set default ease
    changeEase(self.elements, self.settings.animationEase, 0.75, 0.2);

    
    // set default animation
    let animation = function(elements){
        console.log(elements);
        // tl.clear();
        // tl = new TimelineLite({
        //     onComplete:function() {
        //         setTimeout(() => { this.restart(); }, 500);
        //     }
        // });
        tl
            .to(state, self.settings.animationTime, elements[1].polylines) 
            .to(state, self.settings.animationTime, elements[0].polylines,  self.settings.animationTime + 0.5)

            // tl.play();
            
    }
    // animation start
    animation(self.elements);


    // initialize dat.gui ( if need )/*
    if(self.datGUI){
        let gui = new dat.GUI();
        let controllerAnimationTime = gui.add(self.settings, 'animationTime', 0,5);
        let controllerAnimationEase = gui.add(self.settings, 'animationEase', [ 'elastic', 'linear', 'back', 'bounce' ]);
        let controllerAnimationEaseX = gui.add(self.settings, 'animationEaseX', 0,3).step(0.1);
        let controllerAnimationEaseY = gui.add(self.settings, 'animationEaseY', 0,3).step(0.1);

        controllerAnimationTime.onFinishChange(function() { restartTimeline(tl, animation(self.elements)) });
        controllerAnimationEase.onChange(function(value) { 
            self.settings.animationEase = value; 
            changeEase(self.elements, self.settings.animationEase, self.settings.animationEaseX, self.settings.animationEaseY );
            restartTimeline(tl, animation(self.elements));
        });
        controllerAnimationEaseX.onFinishChange(function(value) { 
            self.settings.animationEaseX = value; 
            changeEase(self.elements, self.settings.animationEase, self.settings.animationEaseX, self.settings.animationEaseY )
            restartTimeline(tl, animation(self.elements));
        });
        controllerAnimationEaseY.onFinishChange(function(value) { 
            self.settings.animationEaseY = value; 
            changeEase(self.elements, self.settings.animationEase, self.settings.animationEaseX, self.settings.animationEaseY );
            restartTimeline(tl, animation(self.elements));
        });
    }
    

    // render current state
    function render(state){
        ctx.clearRect(0,0,self.width,self.height);
        // draw in reverse order to hide unused triangles
		for (let i = state.length; i >= 0; i -= 6) {
			drawTriangle(ctx, state[i],  state[i+1],  state[i+2],  state[i+3],  state[i+4], state[i+5]);
        }
    }

    // render start
    render(state);
    

    //========================================================================================

    window.addEventListener('resize', function(event){
        self.width = self.rootElement.offsetWidth || options.root.clientWidth;
        self.height = self.rootElement.offsetHeight ||  self.rootElement.clientHeight;
        canvas.width = self.width;
        canvas.height = self.height;
        // // console.log(self.width, self.height);
        self.elements = transformTriangle(self.elements, self.elementsOriginal, self.width, self.height);
        // // console.log('resize', self.elements);
        // self.elements.forEach(function(item){
        //     let voidValue = ( self.width + self.height ) / 4;
        //     item.polylines = arrayUtility.padArray(item.polylines,54*6,voidValue);
        // });
        // let state = [];
        // self.elements[0].polylines.forEach(function(item, i, arr) {
        //     state.push(item);
        // });
        // render(state);
        animation(self.elements);



        
        // tl.remove();
        // tl = new TimelineLite({
        //     onComplete:function() {
        //         setTimeout(() => { this.restart(); }, 500);
        //     }
        // });
        // tl.progress(0).pause().play(0).clear();
        
        // console.log('------------------');
        // console.log(tl);
        // tl.kill(state);
        // tl
        //     .to(state, self.settings.animationTime, self.elements[1].polylines) 
        //     .to(state, self.settings.animationTime, self.elements[0].polylines,  self.settings.animationTime + 0.5)
        // console.log(tl);
        // animation(self.elements);
        // tl.restart();

    });

}
