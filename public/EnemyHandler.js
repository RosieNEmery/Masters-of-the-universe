class EnemyHandler{
  constructor(){
    this.enemy_stack = [];

    //for testing
    let pos = new THREE.Vector3(0,2,0);
    this.spawnEnemy(1, 3, pos);
  }

  spawnEnemy(select, text_index, pos){
    let texture_select = Math.floor(Math.random(16));
    let enemy = new Enemy(1, this.enemy_stack.length, 3, pos);
    this.enemy_stack.push(enemy);
  }

  removeEnemy(index){
    this.enemy_stack[index].deleteEnemy();
    this.enemy_stack.splice(index, 1);
  }

  update(){
    for(let i = 0; i < this.enemy_stack.length; i++){
      let deleted = this.enemy_stack[i].update();
      if(deleted === true){
        this.removeEnemy(i);
      }
    }
  }

  updateEnemyLife(index){
    let life = this.enemy_stack[index].updateLife();
    if(life <= 0){
      this.removeEnemy(index);
    }
  }
}
