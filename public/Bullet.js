class BulletStack{
  constructor(scene){
    this.scene = scene;
    this.bullet_stack = [];
    this.tex_stack = [];
    this.bullet_vel = new THREE.Vector3(0.0, 0.05, 0.0);
    this.createMesh();
  }

  createMesh(){
    let pos_offsets = [];
    let tex_offsets = [];

    let num_instances = 1000;

    this.buffer_geo = new THREE.PlaneBufferGeometry(0.07, 0.07);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = this.buffer_geo.index;
    this.geo.attributes.position = this.buffer_geo.attributes.position;
    this.geo.attributes.uv = this.buffer_geo.attributes.uv;

    for (let i = 0; i < num_instances; i++){
      pos_offsets.push(0, 0, 0);
      tex_offsets.push(0);
    }

    this.pos_offset_attribute = new THREE.InstancedBufferAttribute( new Float32Array(pos_offsets), 3).setDynamic(true);
    this.tex_offset_attribute = new THREE.InstancedBufferAttribute( new Float32Array(tex_offsets), 1).setDynamic(true);
    this.geo.addAttribute("pos_offset", this.pos_offset_attribute);
    this.geo.addAttribute("tex_offset", this.tex_offset_attribute);

    let Bullet_vertShader = document.querySelector('#bullet_vertexshader');
    let Bullet_fragShader = document.querySelector('#bullet_fragmentshader');

    const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
    texture.wrapS = THREE.RepeatWrapping;

    let u_bullet_selection = 1.0;
    let t = this;
    setInterval(function(){t.updateTextures()}, 50);


    const bullet_uniforms = {
    		texture : {type: 't', value: texture},
    		u_selection: {type: 'f', value: u_bullet_selection},
        u_sprite: {type: 'i', value: 5}
    };

    let material = new THREE.RawShaderMaterial( {
      uniforms: bullet_uniforms,
      vertexShader: Bullet_vertShader.textContent,
      fragmentShader: Bullet_fragShader.textContent,
      transparent: true
    } );
    this.mesh = new THREE.Mesh(this.geo, material);
    this.scene.add(this.mesh);

  }

  shoot(origin){
    this.bullet_stack.push(origin);
    this.tex_stack.push(0);
  }

  update(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      let new_pos = new THREE.Vector3(0, 0, 0);
      new_pos.addVectors(this.bullet_stack[i], this.bullet_vel)
      if (Math.abs(new_pos.y) > 3){
        this.bullet_stack.splice(i, 1);
        this.tex_stack.splice(i, 1);
      }
      else{
        this.bullet_stack[i] = new_pos;
      }
    }
    for( let i = 0; i < this.bullet_stack.length; i++){
      let index = i * 3;
      this.pos_offset_attribute.setXYZ(i, this.bullet_stack[i].x, this.bullet_stack[i].y, this.bullet_stack[i].z);
    }
    this.geo.maxInstancedCount = this.bullet_stack.length;
    this.pos_offset_attribute.needsUpdate = true;
    this.tex_offset_attribute.needsUpdate = true;
  }

  updateTextures(){
    for(let i = 0; i < this.tex_stack.length; i++){
      let new_tex = this.tex_stack[i];
      new_tex = (new_tex + 1)%16;
      this.tex_stack[i] = new_tex;
      this.tex_offset_attribute.setX(i, new_tex);
    }
  }

  print(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      console.log(this.bullet_stack[i]);
    }
  }

}
