
//flame_material.uniforms.u_flame_mult.value = (player_vel.y * -3) + 1;

class Player{
  constructor(scene, global_key_states){
    //for flames/stuff thats parented to it
    this.child_array = [];

    this.global_key_states = global_key_states;

    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.bullets = new BulletStack(scene);

    this.speed_limit = 0.1;
    this.bank_limit = 0.1;
    this.acc = 0.01;

    this.createMesh();
    this.createFlames();
  }

  createMesh(){
    //Create player shader
    let Player_vertShader = document.querySelector('#vertexshader');
    let Player_fragShader = document.querySelector('#fragmentshader');

    const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
    texture.wrapS = THREE.RepeatWrapping;

    const player_uniforms = {
    		texture : {type: 't', value: texture},
    		u_selection: {type: 'f', value: u_player_selection},
        u_sprite: {type: 'i', value: 0}
    };

    //custom material
    const player_material = new THREE.ShaderMaterial({
    		uniforms: player_uniforms,
    		vertexShader:   Player_vertShader.textContent,
    		fragmentShader: Player_fragShader.textContent,
    		transparent: true
    });

    //does switching of sprite along row
    var u_player_selection = 1.0;
    setInterval(function() {
    	u_player_selection += 1;
    	if(u_player_selection > 16)
    		u_player_selection = 1;

    		player_material.uniforms.u_selection.value = u_player_selection;
    }, 50);

    //add mesh to scene
    const player_geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);
    this.mesh = new THREE.Mesh(player_geometry, player_material);
    scene.add(this.mesh);
  }

  createFlames(){
    //creates Flame objects
    this.flame_left = new Flame(scene, new THREE.Vector3(-0.25, -0.34, 0.01), this);
    this.flame_right = new Flame(scene, new THREE.Vector3(0.25, -0.34, 0.01), this);

    //parent to player
    this.addChild(this.flame_left);
    this.addChild(this.flame_right);
  }

  addChild(child){
    this.mesh.add(child.mesh);
    this.child_array.push(child);
  }

  update(){
    this.keyHandler();

    this.bullets.update();

    this.pos.add(this.vel);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    var bank = this.vel.x * 5;
    clamp(bank, -this.bank_limit, this.bank_limit);
    this.mesh.rotation.set(0, bank, 0);
  }

  keyHandler(){
    if(this.global_key_states[87] || this.global_key_states[38]){
      this.vel.y += this.acc;
    }
    else if(this.global_key_states[83] || this.global_key_states[40]){
      this.vel.y -= this.acc;
    }
    else{
      this.vel.y *= 0.9;
    }
    if(this.global_key_states[65] || this.global_key_states[37]){
      this.vel.x -= this.acc;
    }
    else if(this.global_key_states[68] || this.global_key_states[39]){
      this.vel.x += this.acc;
    }
    else
    {
      this.vel.x *= 0.9;
    }
    this.vel.clampScalar(-this.speed_limit, this.speed_limit);

    if(this.global_key_states[32]){
      this.shoot();
      this.global_key_states[32] = 0;
    }
  }

  shoot(){
    let x_offset = 0.27;
    let y_offset = 0.4;
    this.bullets.shoot(new THREE.Vector3(this.pos.x + x_offset, this.pos.y + y_offset, this.pos.z));
    this.bullets.shoot(new THREE.Vector3(this.pos.x - x_offset, this.pos.y + y_offset, this.pos.z));
  }

  deletePlayer(){
    //clean up flames
    for(let i =0; i<this.child_array.length; i++){
        this.child_array[i].deleteFlame();
    }
    this.child_array.length = 0;

    scene.remove(this.mesh);
    //safeguard
    if(this.geometry) this.geometry.dispose();
    if(this.material) this.material.dispose();
    if(this.texture) this.texture.dispose();
  }

}
