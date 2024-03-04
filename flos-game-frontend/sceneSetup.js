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

const oldFov = camera.fov;
function handleResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
  if (window.innerWidth < window.innerHeight) {
    camera.fov = 100;
    camera.updateProjectionMatrix();
  }else{
    const aspectRatio = newHeight / newWidth;
    camera.fov = oldFov;
    camera.updateProjectionMatrix();
  }
}
handleResize();
window.addEventListener('resize', handleResize)
window.addEventListener('orientationchange', handleResize)

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

export {scene, renderer, camera, raycaster, mouse}
