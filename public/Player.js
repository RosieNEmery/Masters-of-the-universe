
//flame_material.uniforms.u_flame_mult.value = (player_vel.y * -3) + 1;

class Player{
  constructor(mesh, global_key_states){
    this.mesh = mesh;
    this.global_key_states = global_key_states;

    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);

    this.speed_limit = 0.1;
    this.bank_limit = 0.1;
    this.acc = 0.01;
  }

  update(){
    this.keyHandler();
    this.pos.add(this.vel);
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    var bank = this.vel.x * 5;
    this.clamp(bank, -this.bank_limit, this.bank_limit);
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
    }
  }

  shoot(){
    console.log("bam");
  }

  clamp(a, upper_limit, lower_limit){
    return Math.max(Math.min(a, upper_limit), lower_limit);
  }

}
