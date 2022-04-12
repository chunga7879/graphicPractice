/*
 * UBC CPSC 314, 2021WT1
 * Assignment 2 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms

const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };

const time = {type: 'float', value: 0}

// Materials: specifying uniforms and shaders

const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightOffset: lightOffset,
  }
});

const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    // HINT pass uniforms to sphere shader here
    time: time,
  }
});

const eyeMaterial = new THREE.ShaderMaterial();

const armadilloFrame = new THREE.Object3D();
armadilloFrame.position.set(0, 0, -8);
scene.add(armadilloFrame);


// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];
});

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, armadilloFrame, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.position.y = 5.3
  armadillo.scale.set(0.1, 0.1, 0.1);
});

// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);
sphereLight.position.set(0, 10, 0);
sphere.position.set(0, 10, 5);

// Eyes (Q1a and Q1b)
// Create the eye ba.ll geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);

// HINT Q1a: Add the eyes on the armadillo here.
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.scale.set(0.5, 0.5, 0.5);
armadilloFrame.add(rightEye);
rightEye.position.set(-0.6, 12.5, 3.1);

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.scale.set(0.5, 0.5, 0.5);
armadilloFrame.add(leftEye);
leftEye.position.set(0.6, 12.5, 3.1);

// Laser Beams (Q1b Q1c)

// Distance threshold beyond which the armadillo should shoot lasers at the sphere (needed for Q1c).
const LaserDistance = 10.0;

const laserGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.0);
const laserMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false });

// HINT Q1b: create the two lasers and apply the appropriate transformations.
//           you can use a Quaternion object for the rotation and a generic Object3D for scaling.
// HINT: Create meshes for the lasers with the above geometry and material
// HINT: What should we use as the parent objects for the laser meshes?

const rightWorldPosition = new THREE.Vector3(0, 0, 0);
rightEye.getWorldPosition(rightWorldPosition);
const leftWorldPosition = new THREE.Vector3(0, 0, 0);
leftEye.getWorldPosition(leftWorldPosition);


const rightEyeLaser = new THREE.Mesh(laserGeometry, laserMaterial);
rightEyeLaser.position.set(0, 0, 0);
rightEye.add(rightEyeLaser);

const leftEyeLaser = new THREE.Mesh(laserGeometry, laserMaterial);
leftEyeLaser.position.set(0, 0, 0);
leftEye.add(leftEyeLaser);

const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
leftEyeLaser.applyQuaternion(quaternion);
rightEyeLaser.applyQuaternion(quaternion);

let sphereWorldPosition = new THREE.Vector3(0, 0, 0);
let meshWorldPosition = new THREE.Vector3(0, 0, 0);

const heartShape = new THREE.Shape();

heartShape.moveTo( 25, 25 );
heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

const extrudeSettings = { depth: 30, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 2, bevelThickness: 10 };

const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

const mesh = new THREE.Mesh( geometry, material );
mesh.scale.set(0.04, 0.04, 0.04);
mesh.position.set( 0, 1.9, 0.7 );
mesh.translateX(-1.0);
const quaternionh = new THREE.Quaternion();
quaternionh.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI );
mesh.applyQuaternion(quaternionh);
sphere.add( mesh );

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  // move forward
  if (keyboard.pressed("W")) {
    sphere.translateZ(0.2);
  }

  // move left
  if (keyboard.pressed("A")) {
    sphere.translateX(-0.2);
  }

  // move backward
  if (keyboard.pressed("S")) {
    sphere.translateZ(-0.2);
  }

  // move right
  if (keyboard.pressed("D")) {
    sphere.translateX(0.2);
  }

  // move up
  if (keyboard.pressed("Q")) {
    sphere.translateY(0.2);
  }

  // move down
  if (keyboard.pressed("E")) {
    sphere.translateY(-0.2);

  }

  sphere.getWorldPosition(sphereWorldPosition);
  mesh.getWorldPosition(meshWorldPosition);

  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;

  // Distance to orb
  // HINT Q1b and Q1c: set/update the position (for static and tracking lasers) and scale (laser length) needed for tracking here.
  // HINT: three.js Positions have a distanceTo function which gives you the distance between two points.
  // HINT: three.js Meshes have a visible property which you can use to hide or show the lasers.

  if (rightWorldPosition.distanceTo(sphereWorldPosition) < LaserDistance) {
    rightEyeLaser.visible = true;
    mesh.visible = true;

    // * 2 because eyes are scaled by 0.5
    rightEyeLaser.scale.set(2, rightWorldPosition.distanceTo(meshWorldPosition) * 2, 2);

    let disR = rightWorldPosition.distanceTo(sphereWorldPosition);
    rightEyeLaser.position.z = disR;

  } else {
    rightEyeLaser.visible = false;
    mesh.visible = false;
  }

  if (leftWorldPosition.distanceTo(sphereWorldPosition) < LaserDistance) {
    leftEyeLaser.visible = true;
    mesh.visible = true;

    leftEyeLaser.scale.set(2, leftWorldPosition.distanceTo(sphereWorldPosition) * 2, 2);

    let disL = rightWorldPosition.distanceTo(meshWorldPosition);
    leftEyeLaser.position.z = disL;

  } else {
    leftEyeLaser.visible = false;
    mesh.visible = false;
  }

}

// Setup update callback
function update() {


  checkKeyboard();

  time.value += 1/60;//Assumes 60 frames per second

  // HINT: Use one of the lookAt functions available in three.js to make the eyes look at the orb.
  leftEye.lookAt(sphereWorldPosition);
  rightEye.lookAt(sphereWorldPosition);


  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
