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
// Create the eye ball geometry
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
    // * 2 because eyes are scaled by 0.5 and lazer is the child of the parent (need to *2) to offset the scaling by parent
    rightEyeLaser.scale.set(2, rightWorldPosition.distanceTo(sphereWorldPosition) * 2, 2);

    // The position of the laser in the eye frame. As eye, the parent of the laser, look at the sphere position, z-axis of the eyeframe
    // is always direct to the sphere. Therefore, just adjust of the position at the z-axis for the laser. Don't need to divide by 2
    // because of the scaling of the eye. (1/2 * 2 = 1)
    let disR = rightWorldPosition.distanceTo(sphereWorldPosition);
    rightEyeLaser.position.z = disR;

  } else {
    rightEyeLaser.visible = false;
  }

  if (leftWorldPosition.distanceTo(sphereWorldPosition) < LaserDistance) {
    leftEyeLaser.visible = true;
    leftEyeLaser.scale.set(2, leftWorldPosition.distanceTo(sphereWorldPosition) * 2, 2);

    let disL = leftWorldPosition.distanceTo(sphereWorldPosition);
    leftEyeLaser.position.z = disL;

  } else {
    leftEyeLaser.visible = false;
  }

}

// Setup update callback
function update() {
  checkKeyboard();

  time.value += 1/60;//Assumes 60 frames per second

  // HINT: Use one of the lookAt functions available in three.js to make the eyes look at the orb.
  // lookat makes eye to rotate respect to the sphere position.
  // lookat : Rotates the object to face a point in world space.
  leftEye.lookAt(sphereWorldPosition);
  rightEye.lookAt(sphereWorldPosition);

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
