import { TimelineMax } from 'gsap';
import { debounce } from 'underscore';
import dat from 'dat-gui';
import { arrayUtility } from '../../utilities/array-utility';


class MovingTriangles {

    constructor(options) {
        this.root = options.root;
        this.width = options.width;
        this.height = options.height;
        this.elements = options.elements;
        this.ctx = null,
            this.state = [],
            this.tl = new TimelineLite({
                onComplete: function () {
                    setTimeout(() => { this.restart(); }, 500);
                }
            })
    }

    createCanvas() {
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

    removeTimeline() {
        this.tl.progress(0).pause().play(0).clear().kill();
    }

    removeCanvas() {
        this.root.querySelector('.moving-triangles').remove();
        this.ctx = null;
    }
    // set base state
    setState(arr) {
        let state = this.state;
        arr.polylines.forEach(function (item, i, arr) {
            state.push(item);
        });
    }

    drawTriangle(ctx, x1, y1, x2, y2, x3, y3) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        ctx.fillStyle = "rgba(222,4,4," + (0.4 * 1 + Math.abs(Math.cos(x1 / 100) / 4) + Math.abs(Math.sin(y1 / 100) / 4)) + ")";
        // ctx.fillStyle = "rgba(222,4,4," + (0)  + ")";
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.fill();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // draw in reverse order to hide unused triangles
        for (let i = this.state.length; i >= 0; i -= 6) {
            this.drawTriangle(this.ctx, this.state[i], this.state[i + 1], this.state[i + 2], this.state[i + 3], this.state[i + 4], this.state[i + 5]);
        }
    }

    // padding array triangles ( need arrays of the same length )
    padArray() {
        let voidValue = (this.width + this.height) / 4;
        this.elements.forEach(function (item) {
            item.polylines = arrayUtility.padArray(item.polylines, 54 * 6, voidValue);
        });
    }

    // render start
    init() {
        this.ctx = this.createCanvas();
        this.padArray();
        this.setState(this.elements[0]);
    }

    destroy() {
        this.removeTimeline();
        this.removeCanvas();
    }

}

let transformTriangle = function (elements, elementsOriginal, containerWidth, containerHeight) {
    elements = [];
    elementsOriginal.forEach(function (item, index) {
        elements[index] = { polylines: [] }

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
        for (let i = 0; i < item.polylines.length; i += 2) {
            element.x.min = (item.polylines[i] < element.x.min) ? item.polylines[i] : element.x.min;
            element.x.max = (item.polylines[i] > element.x.max) ? item.polylines[i] : element.x.max;
            element.y.min = (item.polylines[i + 1] < element.y.min) ? item.polylines[i + 1] : element.y.min;
            element.y.max = (item.polylines[i + 1] > element.y.max) ? item.polylines[i + 1] : element.y.max;
        }
        // calculate element size
        element.width = element.x.max - element.x.min;
        element.height = element.y.max - element.y.min;
        // calculate new position
        for (let i = 0; i < item.polylines.length; i += 2) {
            elements[index].polylines.push(item.polylines[i] - element.x.min + (containerWidth - element.width) / 2);
            elements[index].polylines.push(item.polylines[i + 1] - element.y.min + (containerHeight - element.height) / 2);
        }

    });

    return elements;
}

let changeEase = function (elements, ease, x, y) {
    switch (ease) {
        case 'elastic':
            elements.forEach(function (item) {
                item.polylines.ease = Elastic.easeOut.config(x, y);
            });
            break;

        case 'linear':
            elements.forEach(function (item) {
                item.polylines.ease = Power0.easeNone;
            });
            break;

        case 'back':
            elements.forEach(function (item) {
                item.polylines.ease = Back.easeOut.config(x);
            });
            break;

        case 'bounce':
            elements.forEach(function (item) {
                item.polylines.ease = Bounce.easeOut;
            });
            break;

        default:
            console.warn('nosearch ease');
    }
}

export default function triangles(options) {
    // set options
    let self = {
        rootElement: options.root,
        width: options.root.offsetWidth || options.root.clientWidth,
        height: options.root.offsetHeight || options.root.clientHeight,
        settings: {
            animationTime: 2 || options.settings.animationTime,
            animationEase: 'elastic' || options.settings.animationEase,
            animationEaseX: 1 || options.settings.animationEaseX,
            animationEaseY: 3 || options.settings.animationEaseY,
        },
        datGUI: false || options.datGUI,
        elements: [],
        elementsOriginal: options.elementsOriginal,
    };

    let triangle;

    // initialize canvas with triangles
    let init = function () {

        // transform elements to center and scale
        self.elements = transformTriangle(self.elements, self.elementsOriginal, self.width, self.height);

        triangle = new MovingTriangles({
            root: self.rootElement,
            width: self.width,
            height: self.height,
            elements: self.elements
        });
        triangle.init();

        // create a function to update render
        triangle.elements.forEach(function (item) {
            item.polylines.onUpdate = function () {
                triangle.render();
            }
        });

        triangle.tl
            .to(triangle.state, self.settings.animationTime, triangle.elements[1].polylines)
            .to(triangle.state, self.settings.animationTime, triangle.elements[0].polylines, self.settings.animationTime + 0.5)

        changeEase(triangle.elements, self.settings.animationEase, self.settings.animationX, self.settings.animationY);

        triangle.render();

    }

    // remove canvas with triangles
    let remove = function () {
        triangle.destroy();
    }

    let restart = debounce(function () {
        remove();
        self.width = self.rootElement.offsetWidth || options.root.clientWidth;
        self.height = self.rootElement.offsetHeight || self.rootElement.clientHeight;
        init();
    }, 100);

    // initialize dat.gui ( if need )
    if (self.datGUI) {

        let gui = new dat.GUI();

        let controllerAnimationTime = gui.add(self.settings, 'animationTime', 0, 5);
        let controllerAnimationEase = gui.add(self.settings, 'animationEase', ['elastic', 'linear', 'back', 'bounce']);

        controllerAnimationTime.onFinishChange(function (value) {
            self.settings.controllerAnimationTime = value;
            restart();
        });
        controllerAnimationEase.onChange(function (value) {
            self.settings.animationEase = value;
            restart();
        });

    }

    // initialize triangles 
    init();
    window.addEventListener('resize', function (event) { restart() });

}