import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer
} from 'three';

// 1 The scene
const scene = new Scene();

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
const sizes = {
    width: 800,
    height: 600
};

const camera = new PerspectiveCamera(75, sizes.width/sizes.height);
scene.add(camera);
camera.position.z = 3;

// 4 The renderer
const canvas = document.getElementById('three-canvas');
const renderer = new WebGLRenderer( { canvas });
renderer.setSize(sizes.width, sizes.height, false);


function animate() {
    orangeCube.rotation.x += 0.01;
    orangeCube.rotation.z += 0.01;
    
    bigBlueCube.rotation.x -= 0.02;
    bigBlueCube.rotation.z -= 0.02;
    
    greenCube.rotation.x += 0.02;
    greenCube.rotation.z += 0.02;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();