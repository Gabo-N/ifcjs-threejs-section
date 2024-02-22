import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1 The scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 The objects
const geometry = new BoxGeometry(0.5, 0.5, 0.5);
const orangeMaterial = new MeshBasicMaterial({color: 'orange'});
const blueMaterial = new MeshBasicMaterial({color: 'blue'});
const greenMaterial = new MeshBasicMaterial({color: 'green'});
const orangeCube = new Mesh(geometry, orangeMaterial);
const bigBlueCube = new Mesh(geometry, blueMaterial);
const greenCube = new Mesh(geometry, greenMaterial);
bigBlueCube.position.x += 1.5;
bigBlueCube.scale.set(2, 2, 2);
greenCube.position.x -= 1;

scene.add(orangeCube, bigBlueCube, greenCube);

// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
scene.add(camera);
camera.position.z = 3;

// 4 The renderer
const renderer = new WebGLRenderer( { canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

// 5 Responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
})

// 6 Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 7 Animation

function animate() {
    controls.update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();