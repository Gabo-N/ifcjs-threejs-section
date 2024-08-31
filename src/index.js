import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock,
    MeshLambertMaterial,
    MeshPhongMaterial,
    DirectionalLight,
    TextureLoader,
    AmbientLight,
    HemisphereLight,
    SphereGeometry,
    AxesHelper,
    GridHelper,
    PointsMaterial,
    Points,
    LineBasicMaterial,
    EdgesGeometry,
    LineSegments,
    WireframeGeometry
} from 'three';
import CameraControls from 'camera-controls';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// 1 The scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);

// 2 The objects

// const material = new MeshLambertMaterial({color: 'orange'});
// const geometry = new BoxGeometry();
// const cubeMesh = new Mesh(geometry, material);
// scene.add(cubeMesh);

// const cubeMesh2 = new Mesh(geometry, material);
// cubeMesh2.position.x +=2;
// scene.add(cubeMesh2);

// const cubes = [cubeMesh, cubeMesh2];

// const label = document.createElement('h1');
// label.textContent = 'Hello World!'
// label.classList.add('red-background');
// const labelObject = new CSS2DObject(label);
// scene.add(labelObject);


const loader = new GLTFLoader();

const loadingElem = document.querySelector('#loader-container');
const loadingText = loadingElem.querySelector('p');
// loadingElem.classList.add('hidden');

let policeStation;

loader.load('../assets/police_station.glb',

	( gltf ) => {
        policeStation = gltf.scene
        loadingElem.style.display = 'none';
        // loadingElem.classList.add('hidden');
		scene.add(policeStation);
	},

	( progress ) => {
    const current = (progress.loaded /  progress.total) * 100;
    const formatted = Math.trunc(current * 100) / 100; 
    loadingText.textContent = `Loading: ${formatted}%`;
	},

	( error ) => {

		console.log( 'An error happened: ', error );

	}
);

// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
scene.add(camera);
camera.lookAt(axes.position);


// 4 The renderer
const renderer = new WebGLRenderer( { canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor(0x333333, 1);

const labelRenderer = new CSS2DRenderer;
labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.top = '0';
document.body.appendChild(labelRenderer.domElement);

// 5 Lights

const light1 = new DirectionalLight();
light1.position.set(3, 2, 1).normalize();
scene.add(light1);

const ambientLight = new AmbientLight(0xffffff, .2);
scene.add(ambientLight);

// 6 Responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// 7 Controls

const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp
    }
};

CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);

cameraControls.dollyToCursor = true;

cameraControls.setLookAt(10, 10, 18, 0, 10, 0);

// 8 Picking

const raycaster = new Raycaster();
const mouse = new Vector2();
// const previousSelection = {
//     geometry: null,
//     material: null
// }

// const highlightMaterial = new MeshBasicMaterial({color: 'red'});

// window.addEventListener('mousemove', (event) => {

//     getMousePosition(event);
    
//     raycaster.setFromCamera(mouse,camera);
//     const intersections = raycaster.intersectObjects(cubes);
//     console.log(intersections);
    
    
//     if(hasNotCollisions(intersections)) {
//         restorePreviousSelection();     
//         return;
//     };
    
//     const foundItem = intersections[0];
    
//     if(isPreviousSelection(foundItem)) return;
    
//     restorePreviousSelection();    
//     savePreviousSelection(foundItem);    
//     highlightItem(foundItem);
// })

// function getMousePosition(event) {
//     mouse.x = event.clientX / canvas.clientWidth *2 - 1;
//     mouse.y = -(event.clientY / canvas.clientHeight) *2 + 1;
// }

// function hasNotCollisions(intersections) {
//     return intersections.length ===0;
// }

// function highlightItem(item){
//     item.object.material = highlightMaterial;
// }

// function isPreviousSelection(item) {
//     return previousSelection.mesh === item.object;
// }

// function savePreviousSelection(item) {
//     previousSelection.mesh = item.object;
//     previousSelection.material = item.object.material;
// }
    
// function restorePreviousSelection() {
//     if(previousSelection.mesh) {
//         previousSelection.mesh.material = previousSelection.material;
//         previousSelection.mesh = null;
//         previousSelection.material = null;
//     }
// }

window.addEventListener('dblclick', (event) => {
    mouse.x = event.clientX / canvas.clientWidth *2 - 1;
    mouse.y = -(event.clientY / canvas.clientHeight) *2 + 1;
    raycaster.setFromCamera(mouse,camera);
    const intersections = raycaster.intersectObject(policeStation);
    // console.log(intersections);

    if (!intersections.length) return;
    // const found = intersections[0];
    // console.log(found);

    const collisionLocation = intersections[0].point;

    const message = window.prompt('Write the label text:')

    const label = document.createElement('p');
    label.textContent = message;
    label.classList.add('label');

    const labelObject = new CSS2DObject(label);
    labelObject.position.copy(collisionLocation);
    scene.add(labelObject);
})
 
// 9 Animation

function animate() {
    const delta = clock.getDelta();
	cameraControls.update(delta);
    
    // sunMesh.rotation.y += .01;
    // earthMesh.rotation.y += .05;
    // sunPoints.rotation .y += .01;
    
	renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();


// 9 Debugging


// const gui = new GUI();

// const min = -3;
// const max = 3;
// const step = .01;

// const transformationFolder = gui.addFolder('Transformation');

// transformationFolder.add(sunMesh.position, 'x', min, max, step).name('Sun Position X');
// transformationFolder.add(sunMesh.position, 'y', min, max, step).name('Sun Position Y');
// transformationFolder.add(sunMesh.position, 'z', min, max, step).name('Sun Position Z');

// transformationFolder.close();

// const sunReset = {
//     reset: () => {
//         gsap.to(sunMesh.position, { x: sunMesh.position.x = 0, duration: .5});
//         gsap.to(sunMesh.position, { y: sunMesh.position.y = 0, duration: .5});
//         gsap.to(sunMesh.position, { z: sunMesh.position.z = 0, duration: .5});
//     }
// }

// gui.add(sunReset, 'reset').name('Reset Sun Position');


// gui.addFolder('Sun Visibility').close().add(sunMesh, 'visible');
// gui.addFolder('Earth Visibility').close().add(earthMesh, 'visible');
// gui.addFolder('Moon Visibility').close().add(moonMesh, 'visible');

// const visibilityFolder = gui.addFolder('Visibility');

// visibilityFolder.add(sunMesh, 'visible').name('Sun');
// visibilityFolder.add(earthMesh, 'visible').name('Earth');
// visibilityFolder.add(moonMesh, 'visible').name('Moon');

// visibilityFolder.close();

// const colorParam = {
//     value: 0xffff00
// }

// gui.addColor(colorParam, 'value').name('Sun Color').onChange(() => {
//     sunMesh.material.color.set(colorParam.value);
// })

// const functionParam = {
//     spin: () => {
//         gsap.to(earthMesh.rotation, { z: earthMesh.rotation.z + (Math.PI), duration: 1});
//     }
// }

// gui.add(functionParam, 'spin').name('Earth Z Spin');