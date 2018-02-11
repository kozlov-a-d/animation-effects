import * as THREE from 'three';
import { Scene } from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

export default function lines(options) {

    // set options
    let self = {
        root: options.root,
        width: options.root.offsetWidth || options.root.clientWidth,
        height: options.root.offsetHeight || options.root.clientHeight,
        datGUI: false || options.datGUI,
        canvas: null,
        ctx: null,
        radius: 100,
        countDots: 100,
        countLines: 50
    };


    // create canvas
    self.canvas = document.createElement("canvas");
    self.canvas.className = 'generative-art-lines';
    self.canvas.width = self.width;
    self.canvas.height = self.height;
    self.root.appendChild(self.canvas);


    // create THREE.js renderer
    let renderer = new THREE.WebGLRenderer({
        canvas: self.canvas,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio>1?2:1);
    renderer.setSize(self.width, self.height);
    renderer.setClearColor(0x151414);


    // create THREE.js scene
    let scene = new THREE.Scene();
    let group = new THREE.Group();
    scene.add(group);


    // create THREE.js camera
    let camera = new THREE.PerspectiveCamera(40, self.width/self.height, 1, 1000);
    camera.position.set(0,0,300);


    // create lines assets
    let material = new THREE.LineBasicMaterial({ color: 0xffffff })
    
    // create lines
    for(let i = 0; i < self.countLines; i++){
        let geometry = new THREE.Geometry();
        let line = new THREE.Line(geometry, material);

        for(let j = 0; j < self.countDots; j++){
            let coord = (j/self.countDots)*self.radius*2 - self.radius;
            let vector = new THREE.Vector3(coord, 0,  0);
            geometry.vertices.push(vector);
        }

        line.rotation.x = Math.random()*Math.PI;
        line.rotation.y = Math.random()*Math.PI;
        line.rotation.z = Math.random()*Math.PI;

        group.add(line);
    }
    

    let controls = new OrbitControls(camera, renderer.domElement);

    let updateLines = function(time){
        let vector, line, ratio;
        for(let i = 0; i < self.countLines; i++){
            line = group.children[i];
            for(let j = 0; j < self.countDots; j++){
                vector = line.geometry.vertices[j];
                ratio = 1 - (self.radius-Math.abs(vector.x))/self.radius;
                vector.y = Math.sin(j/5 + time/100)*10*ratio;
            }
            line.geometry.verticesNeedUpdate = true;
        }   
    }

    // begin THREE.js render
    let time = 0;
    function Render(){
        time++;
        renderer.render(scene, camera);
        updateLines(time);
        window.requestAnimationFrame(Render);
    };
    Render();

}