var target_pos = new THREE.Vector3(0,0,0);
var player_pos = new THREE.Vector3(0,0,0);

function playerKeyPress(event){
  if(event.key=="w" || event.key=="ArrowUp"){
    target_pos.y += 1;
  }
  else if(event.key=="s" || event.key=="ArrowDown"){
    target_pos.y -= 1;
  }
  else if(event.key=="a" || event.key=="ArrowLeft"){
    target_pos.x -= 1;
  }
  else if(event.key=="d" || event.key=="ArrowRight"){
    target_pos.x += 1;
  }
  else if(event.key == " "){
    playerShoot();
  }

}

function playerShoot(){
  console.log("pew pew");
}

function playerUpdate(){
  if(player_pos.equals(target_pos) == false){
    var move = new THREE.Vector3(0, 0, 0);
    move.subVectors(target_pos, player_pos);
    move.divideScalar(10);
    move.clampScalar(-0.1, 0.1);

    player_pos.add(move);
    player.position.set(player_pos.x, player_pos.y, player_pos.z);
  }
}
