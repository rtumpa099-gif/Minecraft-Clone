import * as THREE from 'three';
    import { SimplexNoise } from 'SimplexNoise';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x6A5ACD); // warm blue-purple sky
  const camera = new THREE.PerspectiveCamera(110,window.innerWidth/window.innerHeight,0.1,2000);
  camera.rotation.order = 'YXZ';
  let forwardV = new THREE.Vector3();
  let rightV = new THREE.Vector3();
  let upV = new THREE.Vector3();
  function updateVectors(){
  camera.getWorldDirection(forwardV);
       forwardV.y = 0;
  forwardV.normalize();
  rightV.y = 0;
  rightV.normalize();
  rightV.crossVectors(forwardV,camera.up).normalize();
  upV.copy(camera.up);
  }
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.style.background = 'black';
  document.body.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;
 const size = 10;
 const space = 0;
 const block_size = 0.5;
 const noise = new SimplexNoise();
 const loader = new THREE.TextureLoader();
 const geometry1 = new THREE.BoxGeometry(block_size, block_size, block_size);
 const grassSide = loader.load("./textures/grass_side_carried.png");
 const grassTop = loader.load("./textures/grass_carried.png");
 const grassBottom = loader.load("./textures/dirt.png");
 const logTop = loader.load("./textures/log_oak_top.png");
 const logSide = loader.load("./textures/log_oak.png");
 const leaf = loader.load("./textures/oak_leaves.jpg");
 grassSide.magFilter = THREE.NearestFilter;
 grassSide.minFilter = THREE.NearestFilter;
 grassTop.magFilter = THREE.NearestFilter;
 grassTop.minFilter = THREE.NearestFilter;
 grassBottom.magFilter = THREE.NearestFilter;
 grassBottom.minFilter = THREE.NearestFilter;
 grassSide.colorSpace = THREE.SRGBColorSpace;
 grassTop.colorSpace = THREE.SRGBColorSpace;
 grassBottom.colorSpace = THREE.SRGBColorSpace;
 logTop.magFilter = THREE.NearestFilter;
 logTop.minFilter = THREE.NearestFilter;
 logTop.colorSpace = THREE.SRGBColorSpace;
 logSide.magFilter = THREE.NearestFilter;
 logSide.minFilter = THREE.NearestFilter;
 logSide.colorSpace = THREE.SRGBColorSpace;
 leaf.minFilter = THREE.NearestFilter;
 leaf.magFilter = THREE.NearestFilter;
 leaf.colorSpace = THREE.SRGBColorSpace;
const grassSideM = new THREE.MeshBasicMaterial({map:grassSide});
const grassTopM = new THREE.MeshBasicMaterial({map:grassTop});
const grassBottomM = new THREE.MeshBasicMaterial({map:grassBottom});
 const materials1 = [
grassSideM,
grassSideM,
grassTopM,
grassBottomM,
grassSideM,
grassSideM
];
materials1.forEach(material => {
    material.side = THREE.DoubleSide;
});
const logSideM = new THREE.MeshBasicMaterial({map:logSide});
const logTopM = new THREE.MeshBasicMaterial({map:logTop});
const logmaterials = [
logSideM,
logSideM,
logTopM,
logTopM,
logSideM,
logSideM
];
logmaterials.forEach(material => {
    material.side = THREE.DoubleSide;
});
const leafmaterial = new THREE.MeshBasicMaterial({
  map:leaf,
  side:THREE.DoubleSide
});
for (let x = -size; x < size; x++) {
  for (let z = -size; z < size; z++) {
     const height = Math.floor((noise.noise(x * 0.05, z * 0.05) + 1) * 3) + 5;
    for (let y = 0; y < height; y++) 
    {
      let density=0;
    if(y >= 2 && y<12) {
      density=noise.noise(x*0.05 + Math.cos(z*0.2), y*0.2 + Math.sin(x*0.2), z*0.1 + Math.sin(y*0.1));
    }
      const isTop = (y===height-1);
    if(isTop || density < 0.3 || y<2){
      const currentMaterial = isTop ? materials1 : grassBottomM;
    const cube = new THREE.Mesh(geometry1,currentMaterial);
    //cube.castShadow = false;
    //cube.receiveShadow = true;
    cube.position.set(x*(block_size+space),y*(block_size+space),z*(block_size+space));
    scene.add(cube);
    }
    }
      let TreeY = height;
      if(Math.random()<0.009){
      for(let starty = 0;starty<8;starty++){
        const treelog = new THREE.Mesh(geometry1,logmaterials);
        if(starty <4){
        treelog.position.set(x*block_size,(TreeY+starty)*block_size,z*block_size);
          scene.add(treelog);
      }else {
        let sizeofleaf=0;
        if(starty>=4&&starty<6) sizeofleaf=2;
        else if(starty>=6&&starty<7) sizeofleaf=1;
        for(let i=-sizeofleaf;i<=sizeofleaf;i++){
          for(let j=-sizeofleaf;j<=sizeofleaf;j++){
            const leaves = new THREE.Mesh(geometry1,leafmaterial);
            leaves.position.set((x-i)*block_size,(TreeY+starty)*block_size,(z-j)*block_size);
            scene.add(leaves);
          }
        }
      }
        }
    }
  }
  }
    const mob = new THREE.Mesh(new THREE.BoxGeometry(0.7,2,0.7),new THREE.MeshBasicMaterial({
      color:'orange'
    }));
    //mob.castShadow = true;
    //mob.receiveShadow = true;
    let mobX = 0;
    let mobY = 11;
    let mobZ = 0;
    const mob_speed = 0.01;
    let DestinationX = 5;
    let DestinationZ = 10;
    function mobAi(){
    if(Math.abs(DestinationX-mobX)<1 && Math.abs(DestinationZ-mobZ)<1){
    DestinationX = ((Math.random()-1)*10);
    DestinationZ = ((Math.random()-1)*10);
    }
    if (Math.abs(DestinationX - mobX) < mob_speed) {
  mobX = DestinationX;
} else {
  mobX += (DestinationX > mobX) ? mob_speed : -mob_speed;
}
if (Math.abs(DestinationZ - mobZ) < mob_speed) {
  mobZ = DestinationZ;
} else {
  mobZ += (DestinationZ > mobZ) ? mob_speed : -mob_speed;
}
    mob.position.set(mobX,mobY,mobZ);
    requestAnimationFrame(mobAi);
    }
  mobAi();
  scene.add(mob);
  
  const player = new THREE.Mesh(new THREE.BoxGeometry(0.7,2,0.7),new THREE.MeshBasicMaterial({
      color:'blue'
    }));
    //player.castShadow = true;
    //player.receiveShadow = true;
  scene.add(player);
  const jumpbtn = document.getElementById("jump");
  const gravity = 0.009; // Reduced for smoother fall
let verticalVelocity = 0; // Start at zero
let isOnGround = false;

// 1. Jump Logic
document.getElementById("jump").addEventListener("touchstart", () => {
    if (isOnGround) {
        verticalVelocity = -0.15; // Negative to go UP
        isOnGround = false; // Immediately not on ground
    }
});
document.getElementById("jump").addEventListener("touchstart",(e)=>e.preventDefault());
function Gravity() {
    // 2. Apply Gravity to Velocity
    verticalVelocity += gravity;

    // 3. Apply Velocity to Position (subtracting velocity because it's positive)
    camera.position.y -= verticalVelocity;
    mobY -= gravity; // Make sure the mob falls too!

    // Prepare collision boxes
    const cameraBox = new THREE.Box3().setFromCenterAndSize(
        camera.position,
        new THREE.Vector3(block_size-0.3, 1, block_size-0.3)
    );
    const mobBox = new THREE.Box3().setFromCenterAndSize(
     mob.position,
     new THREE.Vector3(block_size-0.3,2,block_size-0.3)
     );
    // 4. FIX: Assume not on ground, then prove it in the loop
    let touchingSomething = false;

    scene.children.forEach(child => {
        if (child.isMesh && child !== mob && child !== player) {
            const blockBox = new THREE.Box3().setFromObject(child);
            
            if (cameraBox.intersectsBox(blockBox)) {
                // If we are falling and hit a block's top
                if (verticalVelocity > 0) { 
                    camera.position.y = blockBox.max.y + 0.4;
                    verticalVelocity = 0;
                    touchingSomething = true;
                }
            }
             if(mobBox.intersectsBox(blockBox)){
                  mobY = blockBox.max.y + 1;
             }
        }
    });

    isOnGround = touchingSomething;
     mob.position.set(mobX,mobY,mobZ);
     requestAnimationFrame(Gravity);
}
  Gravity();
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(0,0);
  let material3;
  const border = new THREE.LineSegments(new THREE.EdgesGeometry(geometry1),new THREE.LineBasicMaterial({color : 'black'}));
  // Add click event listener
    material3 = new THREE.MeshStandardMaterial({ color: 'red', metelness:0,roughness:0});
  document.addEventListener('touchmove', (event) => {
  event.preventDefault();
  document.body.style.touchAction = 'none';
  // Raycasting
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children) 
  // Create new cube
    const intersect = intersects[0];
    if(intersects.length >0){
    if(intersect.distance < 5){
    let face = intersect.face;
    let normal = face.normal.clone();
    normal.transformDirection(intersect.object.matrixWorld).normalize();
    let position = intersect.point.clone().add(normal.multiplyScalar(0.1));
    border.position.set(Math.round(position.x),Math.round(position.y-0.59),Math.round(position.z));
    scene.add(border);
    document.getElementById("place").onclick = () =>{
    const newcube = new THREE.Mesh(geometry1, material3);
    newcube.castShadow = true;
    newcube.receiveShadow = true;
    newcube.position.copy(border.position);
    scene.add(newcube);
    scene.remove(border);
    intersects.length = 0;
  }
    }
    }
  document.getElementById('break').onclick = () =>{
  if(intersects.length > 0 ){
    if(intersect.distance < 5){
  let object = intersects[0].object;
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
  renderer.render(scene,camera);
  scene.remove(border);
  object = null;
  intersects.length = 0;
  }
  }
  }
 });
  camera.position.set(0,7,3);
  camera.lookAt(0,0,0);
  updateVectors();
  
let speed = 0.09;
let IntervalId1;
let IntervalId2;
let IntervalId3;
let IntervalId4;
let IntervalId5;
let IntervalId6;
function move(n) {
  switch(n){
  case 1:{
IntervalId1 = setInterval(()=>{
  camera.position.addScaledVector(upV,speed);
},16);
    break;
  }
  case 2:{
IntervalId2 = setInterval(()=>{
  camera.position.addScaledVector(upV,-speed);
},16);
    break;
  }
  case 3:{
IntervalId3 = setInterval(()=>{
  camera.position.addScaledVector(rightV,-speed);
},16);
    break;
  }
  case 4:{
IntervalId4 = setInterval(()=>{
  camera.position.addScaledVector(rightV,speed);
},16);
    break;
  }
  case 5:{
IntervalId5 = setInterval(()=>{
  camera.position.addScaledVector(forwardV,speed);
},16);
    break;
}
  case 6:{
  IntervalId6 = setInterval(()=>{
  camera.position.addScaledVector(forwardV,-speed);
},16);
    break;
}
  }
}
function stop(n){
  switch(n){
case 1:clearInterval(IntervalId1);break;
case 2:clearInterval(IntervalId2);break;
case 3:clearInterval(IntervalId3);break;
case 4:clearInterval(IntervalId4);break;
case 5:clearInterval(IntervalId5);break;
case 6:clearInterval(IntervalId6);break;
  }
}
let up = document.getElementById("up");
up.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(1);
});
up.addEventListener('touchend',()=>stop(1));
up.addEventListener('touchcancel',()=>stop(1));
  
let down = document.getElementById("down");
down.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(2);
});
down.addEventListener('touchend',()=>stop(2));
down.addEventListener('touchcancel',()=>stop(2));
  
let left = document.getElementById("left");
left.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(3);
});
left.addEventListener('touchend',()=>stop(3));
left.addEventListener('touchcancel',()=>stop(3));
  
let right = document.getElementById("right");
right.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(4);
});
right.addEventListener('touchend',()=>stop(4));
right.addEventListener('touchcancel',()=>stop(4));
  
let front = document.getElementById("front");
front.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(5);
});
front.addEventListener('touchend',()=>stop(5));
front.addEventListener('touchcancel',()=>stop(5));
  
let back = document.getElementById("back");
back.addEventListener('touchstart',(e)=>{
  e.preventDefault();
  move(6);
});
back.addEventListener('touchend',()=>stop(6));
back.addEventListener('touchcancel',()=>stop(6));
  let touchStartX;
  let touchStartY;
document.addEventListener('touchstart',(e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
    document.addEventListener('touchmove', (e) => {
  if (e.touches.length == 1) {
   e.preventDefault();
   const touch = e.touches[0];
   camera.rotation.y += -(touch.clientX - touchStartX) * 0.005;
   camera.rotation.x += -(touch.clientY - touchStartY) * 0.005;
   touchStartX = touch.clientX;
   touchStartY = touch.clientY;
   updateVectors();
  }},{passive:false});
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
dirLight.shadow.camera.left = -100;
dirLight.shadow.camera.right = 100;
dirLight.shadow.camera.top = 100;
dirLight.shadow.camera.bottom = -100;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 600;
dirLight.shadow.normalBias = 0.1;
dirLight.decay = 0;
dirLight.shadow.camera.updateProjectionMatrix();
dirLight.castShadow = true;
scene.add(dirLight);
renderer.shadowMap.enabled = true;
//const helper = new THREE.CameraHelper(dirLight.shadow.camera);
//scene.add(helper);
const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.09);
scene.add(dirLight1);
  
  const Sunmaterial = new THREE.MeshBasicMaterial({
    color: 'orange'});
  const Sungeometry = new THREE.SphereGeometry(2,64,64);
  const sphere = new THREE.Mesh(Sungeometry,Sunmaterial);
  sphere.position.set(5,5,-5);
  scene.add(sphere);
  const value =0.0005;
  let angle = 0;
  const radius = 15;
function animate(){
  requestAnimationFrame(animate);
  player.position.copy(camera.position);
  dirLight1.position.copy(camera.position);
  if(sphere){
  dirLight.position.copy(sphere.position);
  angle += value;
  let sunX = 1 + radius*Math.cos(angle);
  let sunY = 5 + radius*Math.sin(angle);
  sphere.position.set(sunX,sunY,1.5);
  } else dirLight.position.set(0,0,0);
  renderer.render(scene,camera);
}
  animate();

