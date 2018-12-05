var player_pos = new THREE.Vector3(0,0,0);
var player_vel = new THREE.Vector3(0,0,0);


var player_speed_limit = 0.1;
var player_bank_limit = 0.1;
var player_acc = 0.01;


function playerShoot(){
  console.log("pew pew");
}

function playerUpdate(){
  this.playerKeyHandler();
  player_pos.add(player_vel);
  player.position.set(player_pos.x, player_pos.y, player_pos.z);
  var bank = player_vel.x * 5;
  this.clamp(bank, -player_bank_limit, player_bank_limit);
  player.rotation.set(0, bank, 0);
}

function playerKeyHandler(){
  if(key_state[87] || key_state[38]){
    player_vel.y += player_acc;
  }
  else if(key_state[83] || key_state[40]){
    player_vel.y -= player_acc;
  }
  else{
    player_vel.y *= 0.9;
  }
  if(key_state[65] || key_state[37]){
    player_vel.x -= player_acc;
  }
  else if(key_state[68] || key_state[39]){
    player_vel.x += player_acc;
  }
  else
  {
    player_vel.x *= 0.9;
  }
  player_vel.clampScalar(-player_speed_limit, player_speed_limit);

  if(key_state[32]){
    this.playerShoot();
  }
}
