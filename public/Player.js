var target_pos = new THREE.Vector3(0,0,0);
var player_pos = new THREE.Vector3(0,0,0);

var flame_event = new THREE.Object3D();
THREE.EventDispatcher.call( flame_event );

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
    move.divideScalar(15);
    move.clampScalar(-0.1, 0.1);

    player_pos.add(move);

    if(player_pos.y > player.position.y){
      flame_event.dispatchEvent({type:'flame_on', message:true});
    } else{
      flame_event.dispatchEvent({type:'flame_on', message:false});
    }

    player.position.set(player_pos.x, player_pos.y, player_pos.z);
    player.rotation.set(0, move.x*10, 0);
  }
}
