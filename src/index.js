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

// 1 The scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.material.depthTest = false;
scene.add(grid);

// 2 The objects

const loader = new TextureLoader();

const radius = 0.5;
const widthSegments = 12;
const heightSegments = 8;
const geometry = new SphereGeometry(radius, widthSegments, heightSegments);

const sunMaterial = new MeshLambertMaterial({
    color: 'yellow'
});
const earthMaterial = new MeshLambertMaterial({
    color: 'blue',
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
});
const moonMaterial = new MeshLambertMaterial({
    color: 'white',
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
});

const sunMesh = new Mesh(geometry, sunMaterial);
scene.add(sunMesh);

const earthMesh = new Mesh(geometry, earthMaterial);
earthMesh.scale.set(.2, .2, .2);
earthMesh.position.x += 2;
sunMesh.add(earthMesh);

const moonMesh = new Mesh(geometry, moonMaterial);
moonMesh.scale.set(.4, .4, .4);
moonMesh.position.x += 1;
earthMesh.add(moonMesh);

const earthAxes = new AxesHelper();
earthAxes.material.depthTest = false;
earthAxes.renderOrder = 2;
earthMesh.add(earthAxes);

// points geometry
const pointsMaterial = new PointsMaterial({
	color: 'red',
	size: 0.02, // in world units
});

const sunPoints = new Points(geometry, pointsMaterial);
scene.add(sunPoints);


// wireframe geometry
const wireframeMaterial = new LineBasicMaterial({
    color: 'green',
    linewidth: 2
});
const wireframeGeometry = new WireframeGeometry(geometry);
const earthWireframe = new LineSegments(wireframeGeometry,wireframeMaterial);
earthWireframe.scale.set(.2, .2, .2);
earthWireframe.position.x += 2;
sunMesh.add(earthWireframe);


// edges geometry
const edgesMaterial = new LineBasicMaterial({
    color: 'blue',
    linewidth: 2
});
const edgesGeometry = new EdgesGeometry(geometry);
const moonEdges = new LineSegments(edgesGeometry,edgesMaterial);
moonEdges.scale.set(.4, .4, .4);
moonEdges.position.x += 1;
earthMesh.add(moonEdges);

// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
scene.add(camera);
camera.position.x = 6;
camera.position.y = 4;
camera.position.z = 8;
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
// const light2 = new DirectionalLight();
// light2.position.set(-3, 2, -1).normalize();
// scene.add(light2);

const ambientLight = new AmbientLight(0xffffff, .2);
scene.add(ambientLight);

// const hemisphereLight = new HemisphereLight(0xffffff, 0x7075ff, .2);
// scene.add(hemisphereLight);

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


// 8 Animation

function animate() {
    const delta = clock.getDelta();
	cameraControls.update( delta );
    
    sunMesh.rotation.y += .01;
    earthMesh.rotation.y += .05;
    sunPoints.rotation .y += .01;
    
	renderer.render( scene, camera );
    requestAnimationFrame(animate);
}

animate();


// 9 Debugging


const gui = new GUI();

const min = -3;
const max = 3;
const step = .01;

const transformationFolder = gui.addFolder('Transformation');

transformationFolder.add(sunMesh.position, 'x', min, max, step).name('Sun Position X');
transformationFolder.add(sunMesh.position, 'y', min, max, step).name('Sun Position Y');
transformationFolder.add(sunMesh.position, 'z', min, max, step).name('Sun Position Z');

// transformationFolder.close();

const sunReset = {
    reset: () => {
        gsap.to(sunMesh.position, { x: sunMesh.position.x = 0, duration: .5});
        gsap.to(sunMesh.position, { y: sunMesh.position.y = 0, duration: .5});
        gsap.to(sunMesh.position, { z: sunMesh.position.z = 0, duration: .5});
    }
}

gui.add(sunReset, 'reset').name('Reset Sun Position');


// gui.addFolder('Sun Visibility').close().add(sunMesh, 'visible');
// gui.addFolder('Earth Visibility').close().add(earthMesh, 'visible');
// gui.addFolder('Moon Visibility').close().add(moonMesh, 'visible');

const visibilityFolder = gui.addFolder('Visibility');

visibilityFolder.add(sunMesh, 'visible').name('Sun');
visibilityFolder.add(earthMesh, 'visible').name('Earth');
visibilityFolder.add(moonMesh, 'visible').name('Moon');

// visibilityFolder.close();

const colorParam = {
    value: 0xffff00
}

gui.addColor(colorParam, 'value').name('Sun Color').onChange(() => {
    sunMesh.material.color.set(colorParam.value);
})

const functionParam = {
    spin: () => {
        gsap.to(earthMesh.rotation, { z: earthMesh.rotation.z + (Math.PI), duration: 1});
    }
}

gui.add(functionParam, 'spin').name('Earth Z Spin');