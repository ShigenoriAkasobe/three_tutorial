import * as THREE from 'three';

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050711);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  200
);
camera.position.set(0, 0, 40);
scene.add(camera);

// Renderer
const canvasContainer = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Group to rotate attractor slowly
const attractorGroup = new THREE.Group();
scene.add(attractorGroup);

// Lorenz system parameters
const sigma = 10;
const rho = 28;
const beta = 8 / 3;

let x = 0.1;
let y = 0;
let z = 0;

const dt = 0.01;
const subSteps = 5; // Integration steps per frame for smoother curve

// Trail geometry (line with vertex colors)
const maxPoints = 8000;
const positions = new Float32Array(maxPoints * 3);
const colors = new Float32Array(maxPoints * 3);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setDrawRange(0, 0);

const lineMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
});

const line = new THREE.Line(geometry, lineMaterial);
attractorGroup.add(line);

let writeIndex = 0;
let drawnPoints = 0;

const scale = 0.3; // Scale down Lorenz coordinates to fit in view

// Glowing point that follows the trajectory
const pointGeometry = new THREE.SphereGeometry(0.0);
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const tracer = new THREE.Mesh(pointGeometry, pointMaterial);
attractorGroup.add(tracer);

function stepLorenz() {
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;

  x += dx * dt;
  y += dy * dt;
  z += dz * dt;
}

function pushPoint() {
  const i3 = writeIndex * 3;

  const px = x * scale;
  const py = y * scale;
  const pz = z * scale;

  positions[i3] = px;
  positions[i3 + 1] = py;
  positions[i3 + 2] = pz;

  // Color based on height (z) mapped to hue
  const minZ = -30;
  const maxZ = 50;
  const t = Math.max(0, Math.min(1, (z - minZ) / (maxZ - minZ)));

  const color = new THREE.Color();
  color.setHSL(0.7 * (1.0 - t), 1.0, 0.55);

  colors[i3] = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;

  writeIndex = (writeIndex + 1) % maxPoints;
  drawnPoints = Math.min(drawnPoints + 1, maxPoints);
}

// Animation
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Integrate Lorenz system and record points
  for (let i = 0; i < subSteps; i++) {
    stepLorenz();
    pushPoint();
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
  geometry.setDrawRange(0, drawnPoints);

  // Update tracer position to current point
  tracer.position.set(x * scale, y * scale, z * scale);

  // Slowly rotate the whole attractor for better visibility
  attractorGroup.rotation.y = elapsedTime * 0.1;

  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
