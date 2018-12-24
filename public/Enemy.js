
//flame_material.uniforms.u_flame_mult.value = (player_vel.y * -3) + 1;

class Enemy{
  constructor(scene, select, id, event_bus){
    this.select = select;
    this.id = id;
    this.event_bus = event_bus;

    this.child_array = [];

    this.pos = new THREE.Vector3(0, 2.5, -0.1);
    this.vel = new THREE.Vector3(0, -0.01, 0);

    this.speed_limit = 0.1;
    this.acc = 0.01;

    this.createMesh();
  }

  createMesh(){
    var u_sprite_selection = 1.0;
    //Create player shader
    let Enemy_vertShader = document.querySelector('#vertexshader');
    let Enemy_fragShader = document.querySelector('#fragmentshader');

    //look at passing texture to constructure so not loading multiple times
    const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
    texture.wrapS = THREE.RepeatWrapping;

    const enemy_uniforms = {
    		texture : {type: 't', value: texture},
    		u_selection: {type: 'f', value: u_sprite_selection},
        u_sprite: {type:'i', value: this.select}
    };

    //custom material
    const enemy_material = new THREE.ShaderMaterial({
    		uniforms: enemy_uniforms,
    		vertexShader:   Enemy_vertShader.textContent,
    		fragmentShader: Enemy_fragShader.textContent,
    		//transparent: true
    });

    setInterval(function() {
    	u_sprite_selection += 1;
    	if(u_sprite_selection > 16)
    		u_sprite_selection = 1;

    		enemy_material.uniforms.u_selection.value = u_sprite_selection;
    }, 50);

    const enemy_geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    this.mesh = new THREE.Mesh(enemy_geometry, enemy_material);

    this.createFlames();

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.z = Math.PI;

    scene.add(this.mesh);
  }

  createFlames(){
    this.flame_left = new Flame(scene, new THREE.Vector3(-0.25, -0.34, 0.01), this);
    this.flame_right = new Flame(scene, new THREE.Vector3(0.25, -0.34, 0.01), this);

    this.addChild(this.flame_left);
    this.addChild(this.flame_right);
  }

  addChild(child){
    this.mesh.add(child.mesh);
    this.child_array.push(child);
  }

  getID(){
    return this.id;
  }

  update(){
    this.updatePos();

    //update life, look at passing reference of player?
  }

  updatePos(){
    this.pos.add(this.vel);

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);

    if(this.mesh.position.y < -2.5){
      this.deleteEnemy();
    }
  }

  deleteEnemy(){
    this.event_bus.post("deleted", this.id);

    for(let i =0; i<this.child_array.length; i++){
        this.child_array[i].deleteFlame();
    }
    this.child_array.length = 0;

    scene.remove(this.mesh);
    //safeguard
    if(this.geometry) this.geometry.dispose();
    if(this.material) this.material.dispose();
    if(this.texture) this.texture.dispose();

    console.log("enemy deleted");
  }


  shoot(){
    console.log("bam");
  }

}
