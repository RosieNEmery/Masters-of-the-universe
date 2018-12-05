// client-side js
// run by the browser each time your view template is loaded

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = 50;
const FAR_CLIPPING = 1000;
const NEAR_CLIPPING = 0.1;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xdfdfdf);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);

// Create a scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(ASPECT, WIDTH / HEIGHT, NEAR_CLIPPING, FAR_CLIPPING);
camera.lookAt(new THREE.Vector3(0,0,0));
camera.position.set(0,0,1);
scene.add(camera);

//add camera controls
const controls = new THREE.OrbitControls(camera);
controls.update();

document.body.appendChild(renderer.domElement);

//Create shader
let vertShader = require("./shaders/vertex.glsl");
let fragShader = require("./shaders/fragment.glsl");

const texture = new THREE.TextureLoader().load('./img/grass.jpg');
texture.wrapS = THREE.RepeatWrapping;

uniforms = {
		texture : {type: 't', value: texture},
		u_time : {type: "f", value: 0.0},
};

//custom material
const glsl_material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader:   vShader.textContent,
		fragmentShader: fShader.textContent,
		transparent: true,
		depthTest: true
});

//Add a cube to the scene
const plane_geometry = new THREE.PlaneGeometry(1,1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0xffff00});
const plane = new THREE.Mesh(plane_geometry, material);

plane.position.set(0, 0, -2);
scene.add(plane);

attachEventListeners();
//window resize event
function attachEventListeners(){
		window.addEventListener("resize", this.onWindowResize.bind(this), false);
}

function onWindowResize(event){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the render loop
function render(){
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}

render();
