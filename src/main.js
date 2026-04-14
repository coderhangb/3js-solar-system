import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const params = {
  speed: 100,
};
const earthToSunDistance = 100;

// Pane
const pane = new Pane();
pane.addBinding(params, "speed", {
  min: 0,
  max: 10000,
  step: 10,
});

// Scene
const scene = new THREE.Scene();

// Light
const pointLight = new THREE.PointLight(0xffffff, 100000);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.08, 10000);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Add textures
const sunTexture = textureLoader.load("./src/assets/2k_sun.jpg");
const moonTexture = textureLoader.load("./src/assets/2k_moon.jpg");
const earthTexture = textureLoader.load("./src/assets/2k_earth_daymap.jpg");
const mercuryTexture = textureLoader.load("./src/assets/2k_mercury.jpg");
const venusTexture = textureLoader.load("./src/assets/2k_venus_surface.jpg");
const marsTexture = textureLoader.load("./src/assets/2k_mars.jpg");
const jupiterTexture = textureLoader.load("./src/assets/2k_jupiter.jpg");
const saturnTexture = textureLoader.load("./src/assets/2k_saturn.jpg");
const uranusTexture = textureLoader.load("./src/assets/2k_uranus.jpg");
const neptuneTexture = textureLoader.load("./src/assets/2k_neptune.jpg");
textureLoader.load("src/assets/8k_stars_milky_way.jpg", function (texture) {
  scene.background = texture;
});

// =============ADD GEOMETRY================
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Sun
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(20);

// Earth
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.position.x = earthToSunDistance;

// Moon
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.3);
moon.position.x = 2;
earth.add(moon);

// Mercury
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(sphereGeometry, mercuryMaterial);
mercury.scale.setScalar(0.38);
mercury.position.x = earthToSunDistance * 0.39;

// Venus
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(sphereGeometry, venusMaterial);
venus.scale.setScalar(0.95);
venus.position.x = earthToSunDistance * 0.72;

// Mars
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(sphereGeometry, marsMaterial);
mars.scale.setScalar(0.53);
mars.position.x = earthToSunDistance * 1.52;

// Jupiter
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(sphereGeometry, jupiterMaterial);
jupiter.scale.setScalar(11);
jupiter.position.x = earthToSunDistance * 5.2;

// Saturn
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(sphereGeometry, saturnMaterial);
saturn.scale.setScalar(9);
saturn.position.x = earthToSunDistance * 9.58;

// Uranus
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(sphereGeometry, uranusMaterial);
uranus.scale.setScalar(4);
uranus.position.x = earthToSunDistance * 19.18;

// Neptune
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(sphereGeometry, neptuneMaterial);
neptune.scale.setScalar(3.9);
neptune.position.x = earthToSunDistance * 30;

scene.add(sun, earth, mercury, venus, mars, jupiter, saturn, uranus, neptune);

// =============ORBIT=================
function createOrbit(distance, color) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    opacity: 0.5,
    transparent: true,
  });

  const points = [];
  const segments = 100; // point numer
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.sin(angle) * distance,
        0,
        Math.cos(angle) * distance,
      ),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbit = new THREE.LineLoop(geometry, material);
  return orbit;
}

const earthOrbit = createOrbit(earthToSunDistance, 0x555555);
const mercuryOrbit = createOrbit(earthToSunDistance * 0.39, 0xaaaaaa);
const venusOrbit = createOrbit(earthToSunDistance * 0.72, 0xaaaa00);
const marsOrbit = createOrbit(earthToSunDistance * 1.52, 0xff0000);
const jupiterOrbit = createOrbit(earthToSunDistance * 5.2, 0x00ff00);
const saturnOrbit = createOrbit(earthToSunDistance * 9.58, 0x0000ff);
const uranusOrbit = createOrbit(earthToSunDistance * 19.18, 0x00ffff);
const neptuneOrbit = createOrbit(earthToSunDistance * 30, 0x0000ff);

scene.add(
  earthOrbit,
  mercuryOrbit,
  venusOrbit,
  marsOrbit,
  jupiterOrbit,
  saturnOrbit,
  uranusOrbit,
  neptuneOrbit,
);

// Camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  10000,
);
camera.position.set(2, 1, 110);

scene.add(camera);

// Renderer
const canvas = document.querySelector(".canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controler
const controler = new OrbitControls(camera, canvas);
controler.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Rotate delta
const clock = new THREE.Clock();
let earthCurrent = 0;
let mercuryCurrent = 0;
let venusCurrent = 0;
let marsCurrent = 0;
let jupiterCurrent = 0;
let saturnCurrent = 0;
let uranusCurrent = 0;
let neptuneCurrent = 0;

// Renderloop
const renderloop = () => {
  // ==========ADD ANIMATION===========
  const delta = clock.getDelta();
  const oneDayRotation = THREE.MathUtils.degToRad(params.speed) * delta;

  // Earth
  const earthSpeed = oneDayRotation / 365;
  earthCurrent += earthSpeed;
  earth.rotation.y += oneDayRotation;
  earth.position.x = Math.sin(earthCurrent) * earthToSunDistance;
  earth.position.z = Math.cos(earthCurrent) * earthToSunDistance;

  // Mercury
  const mercurySpeed = oneDayRotation / 88;
  mercuryCurrent += mercurySpeed;
  mercury.rotation.y += oneDayRotation * 59;
  mercury.position.x = Math.sin(mercuryCurrent) * earthToSunDistance * 0.39;
  mercury.position.z = Math.cos(mercuryCurrent) * earthToSunDistance * 0.39;

  // Venus
  const venusSpeed = oneDayRotation / 255;
  venusCurrent += venusSpeed;
  venus.rotation.y += oneDayRotation * 243;
  venus.position.x = Math.cos(venusCurrent) * earthToSunDistance * 0.72;
  venus.position.z = Math.sin(venusCurrent) * earthToSunDistance * 0.72;

  // Mars
  const marsSpeed = oneDayRotation / 687;
  marsCurrent += marsSpeed;
  mars.rotation.y += oneDayRotation * 1.03;
  mars.position.x = Math.sin(marsCurrent) * earthToSunDistance * 1.52;
  mars.position.z = Math.cos(marsCurrent) * earthToSunDistance * 1.52;

  // Jupiter
  const jupiterSpeed = oneDayRotation / 4333;
  jupiterCurrent += jupiterSpeed;
  jupiter.rotation.y += oneDayRotation * 0.41;
  jupiter.position.x = Math.sin(jupiterCurrent) * earthToSunDistance * 5.2;
  jupiter.position.z = Math.cos(jupiterCurrent) * earthToSunDistance * 5.2;

  // Saturn
  const saturnSpeed = oneDayRotation / 10759;
  saturnCurrent += saturnSpeed;
  saturn.rotation.y += oneDayRotation * 0.45;
  saturn.position.x = Math.sin(saturnCurrent) * earthToSunDistance * 9.58;
  saturn.position.z = Math.cos(saturnCurrent) * earthToSunDistance * 9.58;

  // Uranus
  const uranusSpeed = oneDayRotation / 30687;
  uranusCurrent += uranusSpeed;
  uranus.rotation.y += oneDayRotation * 0.72;
  uranus.position.x = Math.sin(uranusCurrent) * earthToSunDistance * 19.18;
  uranus.position.z = Math.cos(uranusCurrent) * earthToSunDistance * 19.18;

  // Neptune
  const neptuneSpeed = oneDayRotation / 60190;
  neptuneCurrent += neptuneSpeed;
  neptune.rotation.y += oneDayRotation * 0.67;
  neptune.position.x = Math.sin(neptuneCurrent) * earthToSunDistance * 30;
  neptune.position.z = Math.cos(neptuneCurrent) * earthToSunDistance * 30;

  controler.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
