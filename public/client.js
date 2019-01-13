// client-side js
// run by the browser each time your view template is loaded

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = 50;
const FAR_CLIPPING = 1000;
const NEAR_CLIPPING = 0.1;

//you can change the name if you want
//nah, I like this name too :)
var party_bus = new EventBus();

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);

// Create a scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(ASPECT, WIDTH / HEIGHT, NEAR_CLIPPING, FAR_CLIPPING);
camera.lookAt(new THREE.Vector3(0,0,0));
camera.position.set(0, 0, 10);
scene.add(camera);

document.body.appendChild(renderer.domElement);

//maybe should be passed to objects??////////////////////////////
let player = new Player(key_state);
let enemy_handler = new EnemyHandler();

let fg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.6, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 1.0);
let mg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.5, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 0.7);
let bg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.4, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 0.4);
let col_fx = new FXInstancer(scene, 3, 6, new THREE.Vector3(0, 0, 0), 1000, new THREE.Vector2(1.2, 1.2), 1, false, 50, false, 1.0);
setInterval(function(){fg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 20, 10, ((Math.random()-0.5) * 10)));}, 200 );
setInterval(function(){mg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 30, 10, ((Math.random()-0.5) * 10)-10));}, 100 );
setInterval(function(){bg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 50, 10, ((Math.random()-0.5) * 10)-20));}, 50 );


function detectColisions(){
	player_bullets = player.bullets.instance_stack;
	enemy_array = enemy_handler.enemy_stack;
	for(let e = 0; e < enemy_array.length; e++){
		let e_pos = enemy_array[e].pos;
		for(let b = 0; b < player_bullets.length; b++){
			let b_pos = player_bullets[b].pos;
			let dx = e_pos.x - b_pos.x;
			let dy = e_pos.y - b_pos.y;
			let w = 0.5;
			let h = 0.5;
			if((Math.abs(dx) < w) && (Math.abs(dy) < h)){
				let p = b_pos.clone();
				//p.z -= 0.5;
				col_fx.emitInstance(p);
				player_bullets.splice(b, 1);
				enemy_handler.updateEnemyLife(e);
				//enemy_array[e].deleteEnemy();
				//enemy_array.splice(e, 1);
				break;
			}
		}
	}
}

attachEventListeners();
//window resize event
function attachEventListeners(){
		window.addEventListener("resize", this.onWindowResize.bind(this), false);
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		//party_bus.subscribe("deleted", this.onDelete.bind(this));
}

function onWindowResize(event){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event){
	key_state[event.keyCode || event.which] = true;
	//console.log(event.keyCode);
}

function onKeyUp(event){
	key_state[event.keyCode || event.which] = false;
}

// Start the render loop
function render()
{
  requestAnimationFrame(render);
	detectColisions();
	bg_env_fx.update();
	mg_env_fx.update();
	fg_env_fx.update();
	col_fx.update();
	player.update();
	enemy_handler.update();
  renderer.render(scene, camera);
}

function clearScene(){
	player.deletePlayer();
	while(scene.children.length > 0){
    scene.remove(scene.children[0]);
	}
}


render();
