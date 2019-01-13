let key_state = {};

const SPRITE_SHEET_01 = new THREE.TextureLoader().load('img/contact_out.png')
SPRITE_SHEET_01.wrapS = THREE.RepeatWrapping;


function clamp(a, upper_limit, lower_limit){
  return Math.max(Math.min(a, upper_limit), lower_limit);
}
