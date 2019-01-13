class EnemyHandler{
  constructor(){
    this.enemy_stack = [];
  }

  spawnEnemy(scene, select, id, event_bus, text_index, pos){
    let texture_select = Math.floor(Math.random(16));
    let enemy = new Enemy(scene, 1, enemy_array.length, party_bus, 3, pos);
  }

  removeEnemy(index){
    this.enemy_stack[index].deleteEnemy();
    this.enemy_stack.splice(index, 1);
  }

  update(){
    for(let i = 0; i < this.enemy_stack.length; i++){
      enemy_stack[i].update()
    }
  }
/*
  onDelete(id){
  	if(enemy_array.length > 1) {
  		for(var i = 0; i < enemy_array.length; i++){
  	   if(enemy_array[i].getID() === id) {
  	     enemy_array.splice(i, 1);
  	   }
  		}
  	}
  	else {
  		enemy_array = [];
  	}
  }*/
}
