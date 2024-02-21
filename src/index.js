import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2
} from 'three';

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

window.addEventListener('mousemove', (event) => {
    const position = getMousePosition(event);
    camera.position.x = Math.sin(position.x * Math.PI * 2) * 2;
    camera.position.z = Math.cos(position.x * Math.PI * 2) * 2;
    camera.position.y = position.y * 3;
    camera.lookAt(orangeCube.position);
})

function getMousePosition(event) {
    const position = new Vector2();
    const bounds = canvas.getBoundingClientRect();

    position.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
    position.y = -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;
    
    
    return position;
}

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

//6 Animation

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