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
camera.position.set(0,0,5);
scene.add(camera);

//add camera controls
const controls = new THREE.OrbitControls(camera);
controls.update();


document.body.appendChild(renderer.domElement);

//Add a grid
const player_geometry = new THREE.PlaneGeometry(1, 1, 2);
const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
const player = new THREE.Mesh(player_geometry, material);

scene.add(player);



// Add a directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(directionalLight);

//window resize event
onWindowResize();
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(event)
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}


function  attachEventListners(){
	window.addEventListener("resize", this.onWindowResize.bind(this), false);
	window.addEventListener("keydown", this.onKeyDown.bind(this), false);
}
attachEventListners();

function onKeyDown(event){
	playerKeyPress(event);
}



// Start the render loop
function render()
{
  requestAnimationFrame(render);
	this.playerUpdate();
  controls.update();
  renderer.render(scene, camera);

}

render();
