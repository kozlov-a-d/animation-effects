import * as THREE from 'three';
import { Scene } from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);
import { TimelineMax } from 'gsap';

export default function lines(options) {

    // set options
    let self = {
        root: options.root,
        width: window.innerWidth,
        height: window.innerHeight,
        datGUI: false || options.datGUI,
        canvas: null,
        canvas2d: null,
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
    let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0,0,500);


    // create lines assets
    let material = new THREE.LineBasicMaterial({ color: 0xcccccc })
    
   

    let controls = new OrbitControls(camera, renderer.domElement);

    let size = 440;

    let canvas2d = document.createElement("canvas");
    let ctx = canvas2d.getContext('2d');
    canvas2d.className = 'generative-art-lines-2d';
    canvas2d.width = size;
    canvas2d.height = size;
    self.root.appendChild(canvas2d);

    let data;
    let images = [];
    let imagesData = [];

    images[0] = document.getElementById('photo-1');
    images[1] = document.getElementById('photo-3');
    images[2] = document.getElementById('photo-5');

    for(let i = 0; i < images.length; i++ ){
        ctx.drawImage(images[i], 0, 0, size, size);
        data = ctx.getImageData(0, 0, size, size);
        data = data.data;
        imagesData.push(data);
    }


    let updateLines = function(data){
       
        // let temp = []
        for(let y = 0; y < size; y++){
            let geometry = new THREE.Geometry();
            let line = new THREE.Line(geometry, material);
            for(let x = size; x > 0; x--){
                let bright = data[((size*y) - x) * 4];
                let vector = new THREE.Vector3(x - size/2, y - size/2, bright/20);
    
                geometry.vertices.push(vector);
                // temp.push(vector);
            }
            group.add(line);
            
        }
        // console.log(temp);
        // group.rotation.z = Math.PI;
        // group.rotation.x = Math.PI/10;
        group.rotation.z = Math.PI;
        group.rotation.y = -Math.PI/16;
        group.rotation.x = Math.PI/16;
    }

    


    // begin THREE.js render
    let time = 0;
    let index = 0;
    ctx.drawImage(images[index], 0, 0, size, size);
    updateLines(imagesData[index]);
    function Render(){
        // time++;
        renderer.render(scene, camera);
        // updateLines(time);
        window.requestAnimationFrame(Render);
    };
    Render();

    

    window.addEventListener('click', function (event) { 
        for(let y = group.children.length; y >= 0; y--){
            group.remove(group.children[y]);
        }
        if(index < imagesData.length-1){
            index++;
        } else {
            index = 0;
        }
        ctx.drawImage(images[index], 0, 0, size, size);
        updateLines(imagesData[index]);
    });
    
    window.addEventListener('resize', function (event) { 
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight )
        // updateLines();
    });

} 