// client-side js
// run by the browser each time your view template is loaded

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const ASPECT = 50;
const FAR_CLIPPING = 1000;
const NEAR_CLIPPING = 0.1;
const CAM_HEIGHT = 7.0;

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
camera.position.set(0, 0, CAM_HEIGHT);
camera.name = "camera";
scene.add(camera);

document.body.appendChild(renderer.domElement);

//maybe should be passed to objects??////////////////////////////

var enemy_array = [];

let player = new Player(scene, key_state);
let initial_hp = player.hp;
//scene, sprite to use, enemy id, and event bus
let enemy = new Enemy(scene, 1, enemy_array.length, party_bus, 3);
//Maybe have an enemy container, handle movement too //////////////////////////
enemy_array.push(enemy);

let fg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.6, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 1.0);
let mg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.5, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 0.7);
let bg_env_fx = new FXInstancer(scene, 6, 100, new THREE.Vector3(0, -0.4, 0), 1000, new THREE.Vector2(1, 3), 1, true, 50, false, 0.4);
let col_fx = new FXInstancer(scene, 3, 6, new THREE.Vector3(0, 0, 0), 1000, new THREE.Vector2(1.2, 1.2), 1, false, 50, false, 1.0);

setInterval(function(){fg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 10, 10, ((Math.random()-0.5) * 10)));}, 200 );
setInterval(function(){mg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 20, 10, ((Math.random()-0.5) * 10)-10));}, 100 );
setInterval(function(){bg_env_fx.emitInstance(new THREE.Vector3((Math.random()-0.5) * 40, 10, ((Math.random()-0.5) * 10)-20));}, 50 );

function detectColisions(){
	player_bullets = player.bullets.instance_stack;
	let p_pos = player.pos;
	for(let e = 0; e < enemy_array.length; e++){
		let e_pos = enemy_array[e].pos;
		let e_dmg = 0;
		let p_dmg = 0;

		//enemy and bullet colisions
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
				e_dmg += 1;
			}
		}

		//enemy and player colisons
		let dist = p_pos.manhattanDistanceTo(e_pos);
		if(dist < 1.2){
			let p = p_pos.clone();
			p.lerp(e_pos, 0.5);
			col_fx.emitInstance(p);
			e_dmg += 5;
			p_dmg += 1;
		}

		//damage calculations
		let enemy_hp = enemy_array[e].reduceHP(e_dmg);
		if(enemy_hp == 0){
			col_fx.emitInstance(e_pos);
			enemy_array[e].deleteEnemy();
			enemy_array.splice(e, 1);
		}
		let player_hp = player.reduceHP(p_dmg);
		if(player_hp == 0){
			col_fx.emitInstance(p_pos);
			player.deletePlayer();
		}
	}
}

attachEventListeners();
//window resize event
function attachEventListeners(){
		window.addEventListener("resize", this.onWindowResize.bind(this), false);
		window.addEventListener("keydown", this.onKeyDown.bind(this), true);
		window.addEventListener("keyup", this.onKeyUp.bind(this), true);

		party_bus.subscribe("deleted", this.onDelete.bind(this));
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

function onDelete(id){
	if(enemy_array.length > 1) {
		for(var i = 0; i < enemy_array.length; i++){
	   if(enemy_array[i].getID() === id) {
	     enemy_array.splice(i, 1);
	   }
		}
	}
	else {
		enemy_array = [];
	}
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
	if(enemy_array.length > 0) {
		for(let i=0; i<enemy_array.length; i++){
			enemy_array[i].update();
		}
	}
  renderer.render(scene, camera);
}

function clearScene(){
	player.deletePlayer();
	while(scene.children.length > 0){
    scene.remove(scene.children[0]);
	}
}


render();
