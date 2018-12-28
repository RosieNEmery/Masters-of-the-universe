
//flame_material.uniforms.u_flame_mult.value = (player_vel.y * -3) + 1;

class Flame{
  constructor(scene, pos, parent){
    //create Flame
    this.pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    this.parent = parent;

    this.flame_mult = 1.5;

    this.createMesh();
  }

  createMesh(){
    let flame_selection = 1.0;
    const texture = new THREE.TextureLoader().load('img/contact_out_copy.png');
    texture.wrapS = THREE.RepeatWrapping;

    //Create flame shader
    let Flame_vertShader = document.querySelector('#flame_vertexshader');
    let Flame_fragShader = document.querySelector('#flame_fragmentshader');

    const flame_uniforms = {
    		texture : {type: 't', value: texture},
    		u_selection: {type: 'f', value: flame_selection},
    		u_flame_mult: {type: 'f', value: this.flame_mult}
    };

    //custom flame material
    this.material = new THREE.ShaderMaterial({
    		uniforms: flame_uniforms,
    		vertexShader:   Flame_vertShader.textContent,
    		fragmentShader: Flame_fragShader.textContent,
    		transparent: true
    });
    this.material.depthWrite = false;
    //create geo and move mesh to position
    const flame_geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1);
    this.mesh = new THREE.Mesh(flame_geometry, this.material);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);

    //does switching of sprite along row
    const self = this;
    setInterval(function() {
    		flame_selection += 1;
    		if(flame_selection > 16)
    			flame_selection = 1;

    			self.material.uniforms.u_selection.value = flame_selection;
    	}, 50);

  }

  setFlameMult(new_mult){
    //scale up/down flame
    this.material.uniforms.u_flame_mult.value = new_mult;
  }

  deleteFlame(){
    scene.remove(this.mesh);
    //safeguard
    if(this.geometry) this.geometry.dispose();
    if(this.material) this.material.dispose();
    if(this.texture) this.texture.dispose();
  }

}
