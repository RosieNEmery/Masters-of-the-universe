// client-side js
// run by the browser each time your view template is loaded

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = 50;
const FAR_CLIPPING = 1000;
const NEAR_CLIPPING = 0.1;

var u_player_selection = 1.0;
var u_flame_selection = 1.0;
var flame_on = false;
var flame_mult = 1.5;
var on_timer;
var off_timer;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);

// Create a scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(ASPECT, WIDTH / HEIGHT, NEAR_CLIPPING, FAR_CLIPPING);
camera.lookAt(new THREE.Vector3(0,0,0));
camera.position.set(0, 0, 5);
scene.add(camera);

document.body.appendChild(renderer.domElement);

//Create player shader
let Player_vertShader = document.querySelector('#vertexshader');
let Player_fragShader = document.querySelector('#fragmentshader');

const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
texture.wrapS = THREE.RepeatWrapping;

const player_uniforms = {
		texture : {type: 't', value: texture},
		u_selection: {type: 'f', value: u_player_selection}
};

//custom material
const player_material = new THREE.ShaderMaterial({
		uniforms: player_uniforms,
		vertexShader:   Player_vertShader.textContent,
		fragmentShader: Player_fragShader.textContent,
		side: THREE.DoubleSide,
		//transparent: true
});

//Create flame shader
let Flame_vertShader = document.querySelector('#flame_vertexshader');
let Flame_fragShader = document.querySelector('#flame_fragmentshader');

const flame_uniforms = {
		texture : {type: 't', value: texture},
		u_selection: {type: 'f', value: u_flame_selection},
		u_flame_mult: {type: 'f', value: flame_mult}
};

//custom material
const flame_material = new THREE.ShaderMaterial({
		uniforms: flame_uniforms,
		vertexShader:   Flame_vertShader.textContent,
		fragmentShader: Flame_fragShader.textContent,
		side: THREE.DoubleSide,
		//transparent: true
});

//Add a player to the scene
const player_geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
const player_mesh = new THREE.Mesh(player_geometry, player_material);
let player_updater = new Player(player_mesh, key_state);

const flame_geometry = new THREE.PlaneGeometry(0.4, 0.4, 1, 1);
const flame_01 = new THREE.Mesh(flame_geometry, flame_material);
const flame_02 = flame_01.clone();
flame_01.position.set(-0.25, -0.34, 0.01);
flame_02.position.set(0.25, -0.34, 0.01);

scene.add(player_mesh);
player_mesh.add(flame_01);
player_mesh.add(flame_02);

setInterval(function() {
	u_player_selection += 1;
	if(u_player_selection > 16)
		u_player_selection = 1;

		player_material.uniforms.u_selection.value = u_player_selection;
}, 50);

setInterval(function() {
		u_flame_selection += 1;
		if(u_flame_selection > 16)
			u_flame_selection = 1;

			flame_material.uniforms.u_selection.value = u_flame_selection;
	}, 50);

attachEventListeners();
//window resize event
function attachEventListeners(){
		window.addEventListener("resize", this.onWindowResize.bind(this), false);
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);
}

function onWindowResize(event){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event){
	key_state[event.keyCode || event.which] = true;
}

function onKeyUp(event){
	key_state[event.keyCode || event.which] = false;
}

// Start the render loop
function render()
{
  requestAnimationFrame(render);
	player_updater.update();
  //controls.update();
  renderer.render(scene, camera);
}


render();
