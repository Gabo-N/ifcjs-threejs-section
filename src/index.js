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
    HemisphereLight
} from 'three';
import CameraControls from 'camera-controls';


// 1 The scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 The objects

const loader = new TextureLoader();

const geometry = new BoxGeometry(0.5, 0.5, 0.5);
const orangeMaterial = new MeshLambertMaterial({
    color: 'orange',
    map: loader.load('../assets/sample.jpg')
});
const blueMaterial = new MeshLambertMaterial({
    color: 'blue',
});
const greenMaterial = new MeshPhongMaterial({
    color: 'green',
    specular: 0xffffff,
    shininess: 100,
    flatShading: true
});
const whiteMaterial = new MeshLambertMaterial({
    color: 'white',
});
const orangeCube = new Mesh(geometry, orangeMaterial);
const bigBlueCube = new Mesh(geometry, blueMaterial);
const greenCube = new Mesh(geometry, greenMaterial);
const whiteCube = new Mesh(geometry, whiteMaterial);
bigBlueCube.position.x += 1.5;
bigBlueCube.scale.set(2, 2, 2);
greenCube.position.x -= 1;
whiteCube.position.x -= 2;

scene.add(orangeCube, bigBlueCube, greenCube);
scene.add(whiteCube);

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
const light2 = new DirectionalLight();
light2.position.set(-3, 2, -1).normalize();
scene.add(light2);

const ambientLight = new AmbientLight(0xffffff, .2);
scene.add(ambientLight);

const hemisphereLight = new HemisphereLight(0xffffff, 0x7075ff, .2);
scene.add(hemisphereLight);

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
	renderer.render( scene, camera );
    requestAnimationFrame(animate);
}

animate();