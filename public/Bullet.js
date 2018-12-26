class BulletStack{
  constructor(scene){
    this.scene = scene;
    this.bullet_stack = [];
    this.bullet_vel = new THREE.Vector3(0.0, 0.05, 0.0);
    this.createMesh();
  }

  createMesh(){
    let offsets = [];
    let num_instances = 1000;

    this.buffer_geo = new THREE.PlaneBufferGeometry(0.1, 0.1);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = this.buffer_geo.index;
    this.geo.attributes.position = this.buffer_geo.attributes.position;
    this.geo.attributes.uv = this.buffer_geo.attributes.uv;

    for (let i = 0; i < num_instances; i++){
      offsets.push(0, 0, 0);
    }

    this.offset_attribute = new THREE.InstancedBufferAttribute( new Float32Array(offsets), 3).setDynamic(true);
    this.geo.addAttribute("offset", this.offset_attribute);

    let Bullet_vertShader = document.querySelector('#bullet_vertexshader');
    let Bullet_fragShader = document.querySelector('#bullet_fragmentshader');

    const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
    texture.wrapS = THREE.RepeatWrapping;

    let u_bullet_selection = 1.0;
    setInterval(function() {
    	u_bullet_selection += 1;
    	if(u_bullet_selection > 16)
    		u_bullet_selection = 1;

    		material.uniforms.u_selection.value = u_bullet_selection;
    }, 50);
    const bullet_uniforms = {
    		texture : {type: 't', value: texture},
    		u_selection: {type: 'f', value: u_bullet_selection},
        u_sprite: {type: 'i', value: 5}
    };

    let material = new THREE.RawShaderMaterial( {
      uniforms: bullet_uniforms,
      vertexShader: Bullet_vertShader.textContent,
      fragmentShader: Bullet_fragShader.textContent
    } );
    this.mesh = new THREE.Mesh(this.geo, material);
    this.scene.add(this.mesh);

  }

  shoot(origin){
    this.bullet_stack.push(origin);
  }

  update(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      let new_pos = new THREE.Vector3(0, 0, 0);
      new_pos.addVectors(this.bullet_stack[i], this.bullet_vel)
      if (Math.abs(new_pos.y) > 3){
        this.bullet_stack.splice(i, 1);
      }
      else{
        this.bullet_stack[i] = new_pos;//this.bullet_stack[i] + this.bullet_vel;
      }
    }
    for( let i = 0; i < this.bullet_stack.length; i++){
      let index = i * 3;
      this.offset_attribute.setXYZ(i, this.bullet_stack[i].x, this.bullet_stack[i].y, this.bullet_stack[i].z);
    }
    this.geo.maxInstancedCount = this.bullet_stack.length;
    this.offset_attribute.needsUpdate = true;
  }

  print(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      console.log(this.bullet_stack[i]);
    }
  }

}
