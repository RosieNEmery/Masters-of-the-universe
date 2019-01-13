
//flame_material.uniforms.u_flame_mult.value = (player_vel.y * -3) + 1;

class Enemy{
  constructor(scene, select, id, event_bus, text_index){
    this.select = select;
    this.id = id;
    this.event_bus = event_bus;
    this.text_index = text_index;

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

    const enemy_uniforms = {
    		texture : {type: 't', value: SPRITE_SHEET_01},
    		u_selection: {type: 'f', value: u_sprite_selection},
        u_sprite: {type:'i', value: this.select}
    };

    //custom material
    const enemy_material = new THREE.ShaderMaterial({
    		uniforms: enemy_uniforms,
    		vertexShader:   Enemy_vertShader.textContent,
    		fragmentShader: Enemy_fragShader.textContent,
    		transparent: true,
        depthFunc: THREE.AlwaysDepth
    });

    setInterval(function() {
    	u_sprite_selection += 1;
    	if(u_sprite_selection > 16)
    		u_sprite_selection = 1;

    		enemy_material.uniforms.u_selection.value = u_sprite_selection;
    }, 50);

    const enemy_geometry = new THREE.PlaneBufferGeometry(1, 1, 2, 2);
    this.mesh = new THREE.Mesh(enemy_geometry, enemy_material);

    this.createFlames();
    this.createText();

    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.z = Math.PI;

    scene.add(this.mesh);
  }

  createFlames(){
    this.flame_left = new Flame(scene, new THREE.Vector3(-0.45, 0.1, 0.01), this);
    this.flame_right = new Flame(scene, new THREE.Vector3(0.45, 0.1, 0.01), this);

    this.addChild(this.flame_left);
    this.addChild(this.flame_right);
  }

  createText(){
    let text_vert_shader = document.querySelector('#enemy_text_vert_shader');
    let text_frag_shader = document.querySelector('#enemy_text_frag_shader');

    const text_uniforms = {
    		texture : {type: 't', value: SPRITE_SHEET_01},
    		u_text_index: {type: 'f', value: this.text_index}
    };

    //custom material
    const text_material = new THREE.ShaderMaterial({
    		uniforms: text_uniforms,
    		vertexShader:   text_vert_shader.textContent,
    		fragmentShader: text_frag_shader.textContent,
    		transparent: true,
        depthFunc: THREE.AlwaysDepth
    });

    const text_geometry = new THREE.PlaneBufferGeometry(2.5, 2.5, 2, 2);
    this.text_mesh = new THREE.Mesh(text_geometry, text_material);

    this.text_mesh.rotateZ(-3.141/2);
    this.text_mesh.translateX(0.7);
    this.text_mesh.translateY(0.08);

    this.mesh.add(this.text_mesh)
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
