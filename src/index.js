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

const loader = new GLTFLoader();

const loadingElem = document.querySelector('#loader-container');
const loadingText = loadingElem.querySelector('p');

loader.load('../assets/police_station.glb',

	( gltf ) => {
    loadingElem.style.display = 'none';
		scene.add( gltf.scene );
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

cameraControls.setLookAt(18, 20, 18, 0, 10, 0);


// 8 Animation

function animate() {
    const delta = clock.getDelta();
	cameraControls.update( delta );
    
    // sunMesh.rotation.y += .01;
    // earthMesh.rotation.y += .05;
    // sunPoints.rotation .y += .01;
    
	renderer.render( scene, camera );
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