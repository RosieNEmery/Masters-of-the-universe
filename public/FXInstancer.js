class Instance{
  constructor(pos, age, tex){
    this.pos = pos;
    this.age = age;
    this.tex = tex;
  }
}

class FXInstancer{
  constructor(scene, tex_offset, lifetime, velocity, max_instances, quad_size, uv_scale, loop, tex_interval, flip_quad, render_order){
    //set class attributes
    this.scene = scene;
    this.tex_offset = tex_offset;
    this.lifetime = lifetime;
    this.velocity = velocity;
    this.max_instances = max_instances;
    this.quad_size = quad_size;
    this.uv_scale = uv_scale;
    this.loop = loop;
    this.tex_interval = tex_interval;
    this.flip_quad = flip_quad;
    this.render_order = render_order;

    //init stacks
    this.instance_stack = [];

    //build the mesh
    this.createMesh();
  }

  createMesh(){
    //set up buffer geo
    this.buffer_geo = new THREE.PlaneBufferGeometry(this.quad_size.x, this.quad_size.y);
    if(this.flip_quad){
      this.buffer_geo.rotateZ(3.1415);
    }
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
    setInterval(function(){t.updateTextureOffsets()}, this.tex_interval);

    //set up shader
    let fx_vert_shader = document.querySelector('#fx_vert_shader');
    let fx_frag_shader = document.querySelector('#fx_frag_shader');

    const fx_uniforms = {
      u_texture: {type: 't', value: SPRITE_SHEET_01},
      u_sprite: {type: 'i', value: this.tex_offset},
      u_uv_scale: {type: 'f', value: this.uv_scale}
    };
    //--------* took out raw shader so don't have to pass attribs and camera persp uniforms *--------\\
    const material = new THREE.ShaderMaterial({
      uniforms: fx_uniforms,
      vertexShader: fx_vert_shader.textContent,
      fragmentShader: fx_frag_shader.textContent,
      transparent: true
    });

    //finally create the mesh obj and add it to the Scene
    this.mesh = new THREE.Mesh(this.geo, material);
    //--------* set the render order to fix transparency *--------\\
    this.mesh.renderOrder = this.render_order;
    this.scene.add(this.mesh);
    }

  emitInstance(origin){
    
    this.instance_stack.splice(0, 0, new Instance(origin, 0, 0));
    //this.update();
  }

  update(){
    //init new stacks

    //update temp stacks with non-dead instances
    for(let i = 0; i < this.instance_stack.length; i++){
      if(i > this.max_instances){
        break;
      }
      //this.age_stack[i] += 1;
      if(this.instance_stack[i].age <= this.lifetime){
        let new_pos = new THREE.Vector3(0, 0, 0);
        new_pos.addVectors(this.instance_stack[i].pos, this.velocity);
        this.instance_stack[i].pos = new_pos;
      }
    }

    //update buffers to reflect changes to the stacks
    for(let i = 0; i < this.instance_stack.length; i++){
      this.pos_attrib_arr.setXYZ(i,
                                 this.instance_stack[i].pos.x,
                                 this.instance_stack[i].pos.y,
                                 this.instance_stack[i].pos.z
                               );
      this.tex_attrib_arr.setX(1, this.instance_stack[i].tex);
    }
    //set flags on geo and buffers
    this.geo.maxInstancedCount = this.instance_stack.length;
    this.pos_attrib_arr.needsUpdate = true;
    this.tex_attrib_arr.needsUpdate = true;
  }

  updateTextureOffsets(){
    for(let i = 0; i < this.instance_stack.length; i++){
      this.instance_stack[i].age += 1;
      if(this.instance_stack[i].age > this.lifetime){
        this.instance_stack.splice(i, 1);
      }
    }
    for(let i = 0; i < this.instance_stack.length; i++){
      let new_tex = this.instance_stack[i].tex;
      if(this.loop){
        new_tex = (new_tex + 1)%16;
      }
      else{
        new_tex += 1;
        new_tex = Math.min(15, new_tex);
      }
      this.instance_stack[i].tex = new_tex;
      this.tex_attrib_arr.setX(i, new_tex);
    }
  }
}
