import './style.css'
import * as THREE from 'three'
const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.webgl");
scene.background = new THREE.Color('#145d21')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const renderer = new THREE.WebGLRenderer({
  canvas,
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1, 1000);
camera.position.z = 24;


scene.add(camera);


renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width/sizes.height
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1000))
})

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

export {scene, renderer, camera, raycaster, mouse}
