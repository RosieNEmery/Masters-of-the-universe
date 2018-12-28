class FXInstancer{
  constructor(scene, tex_offset, lifetime, velocity, max_instances, quad_size, uv_scale){
    //set class attributes
    this.scene = scene;
    this.tex_offset = tex_offset;
    this.lifetime = lifetime;
    this.velocity = velocity;
    this.max_instances = max_instances;
    this.quad_size = quad_size;
    this.uv_scale = uv_scale;

    //init stacks
    this.pos_stack = [];
    this.age_stack = [];
    this.tex_stack = [];

    //build the mesh
    this.createMesh();
  }

  createMesh(){
    //set up buffer geo
    this.buffer_geo = new THREE.PlaneBufferGeometry(this.quad_size, this.quad_size);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = this.buffer_geo.index;
    this.geo.attributes.position = this.buffer_geo.attributes.position;
    this.geo.attributes.uv = this.buffer_geo.attributes.uv;

    //temp arrays
    let temp_pos_arr = [];
    let temp_tex_arr = [];
    for(let i = 0; i < this.max_instances; i++){
      temp_pos_arr.push(0, 0, 0);
      temp_tex_arr.push(0);
    }

    //add attribute buffers to instance geometry
    this.pos_attrib_arr = new THREE.InstancedBufferAttribute( new Float32Array(temp_pos_arr), 3).setDynamic(true);
    this.tex_attrib_arr = new THREE.InstancedBufferAttribute( new Float32Array(temp_tex_arr), 1).setDynamic(true);
    this.geo.addAttribute("pos_offset", this.pos_attrib_arr);
    this.geo.addAttribute("tex_offset", this.tex_attrib_arr);

    //set update interval for texture offsets
    let t = this;
    setInterval(function(){t.updateTextureOffsets()}, 50);

    //set up shader
    let fx_vert_shader = document.querySelector('#fx_vert_shader');
    let fx_frag_shader = document.querySelector('#fx_frag_shader');
    //probably shouldnt be loading a new texture each time, but reference a master texture
    let texture = new THREE.TextureLoader().load('img/contact_out_copy.png')
    texture.wrapS = THREE.RepeatWrapping;
    const fx_uniforms = {
      u_texture: {type: 't', value: texture},
      u_sprite: {type: 'i', value: this.tex_offset}
    };
    const material = new THREE.RawShaderMaterial({
      uniforms: fx_uniforms,
      vertexShader: fx_vert_shader.textContent,
      fragmentShader: fx_frag_shader.textContent,
      transparent: true
    });

    //finally create the mesh obj and add it to the Scene
    this.mesh = new THREE.Mesh(this.geo, material);
    this.scene.add(this.mesh);
    }

  emitInstance(origin){
    this.pos_stack.push(origin);
    this.age_stack.push(0);
    this.tex_stack.push(0);
  }

  update(){
    //init new stacks
    let new_pos_stack = [];
    let new_age_stack = [];
    let new_tex_stack = [];

    //update temp stacks with non-dead instances
    for(let i = 0; i < this.pos_stack.length; i++){
      if(i > this.max_instances){
        break;
      }
      this.age_stack[i] += 1;
      if(this.age_stack[i] <= this.lifetime){
        let new_pos = new THREE.Vector3(0, 0, 0);
        new_pos.addVectors(this.pos_stack[i], this.velocity);
        this.new_pos_stack.push(new_pos);
        this.new_age_stack.push(this.age_stack[i]);
        this.new_tex_stack.push(this.tex_stack[i]);
      }
    }
    this.pos_stack = new_pos_stack;
    this.age_stack = new_age_stack;
    this.tex_stack = new_tex_stack;

    //update buffers to reflect changes to the stacks
    for(let i = 0; i < this,pos_stack.length; i++){
      this.pos_attrib_arr.setXYZ(i,
                                 this.pos_stack[i].x,
                                 this.pos_stack[i].y,
                                 this.pos_stack[i].z
                               );
      this.tex_attrib_arr.setX(1, this.tex_stack[i]);
    }
    //set flags on geo and buffers
    this.geo.maxInstancedCount = this.pos_stack.length;
    this.pos_attrib_arr.needsUpdate = true;
    this.tex_attrib_arr.needsUpdate = true;
  }

  updateTextureOffsets(){
    for(let i = 0; i < this.tex_stack.length; i++){
      let new_tex = this.tex_stack[i];
      new_tex = (new_tex + 1)%16;
      this.tex_stack[i] = new_tex;
      this.tex_attrib_arr.setX(i, new_tex);
    }
  }
}
