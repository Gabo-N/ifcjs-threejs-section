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
    SphereGeometry
} from 'three';
import CameraControls from 'camera-controls';


// 1 The scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 The objects

const loader = new TextureLoader();

const geometry = new SphereGeometry(0.5);

const sunMaterial = new MeshLambertMaterial({
    color: 'yellow',
});
const earthMaterial = new MeshLambertMaterial({
    color: 'blue',
});
const moonMaterial = new MeshLambertMaterial({
    color: 'white',
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



// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth/canvas.clientHeight);
scene.add(camera);
camera.position.z = 3;

// 4 The renderer
const renderer = new WebGLRenderer( { canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

// 8 Lights

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
    
	renderer.render( scene, camera );
    requestAnimationFrame(animate);
}

animate();