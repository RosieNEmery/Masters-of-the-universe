class BulletStack{
  constructor(){
    this.bullet_stack = [];
    this.bullet_vel = new THREE.Vector3(0.0, 0.1, 0.0);
  }

  shoot(origin){
    this.bullet_stack.push(origin);
  }

  update(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      let new_pos = new THREE.Vector3(0, 0, 0);
      new_pos.addVectors(this.bullet_stack[i], this.bullet_vel)
      this.bullet_stack[i] = new_pos;//this.bullet_stack[i] + this.bullet_vel;
    }
  }

  print(){
    for( let i = 0; i < this.bullet_stack.length; i++){
      console.log(this.bullet_stack[i]);
    }
  }

}
