import * as THREE from 'three'
const playersPositions = [
    [
      new THREE.Vector3(-8, -10, 5),
      new THREE.Vector3(-4, -10, 5),
      new THREE.Vector3(-0, -10, 5),
      new THREE.Vector3(4, -10, 5)
    ],
    [
      new THREE.Vector3(-8, 10, 5),
      new THREE.Vector3(-4, 10, 5),
      new THREE.Vector3(-0, 10, 5),
      new THREE.Vector3(4, 10, 5)
    ]
  ]
  
  const boardPositions = [
      {pos :new THREE.Vector3(0,4,0), isFree: true},
      {pos :new THREE.Vector3(4,4,0), isFree: true},
      {pos :new THREE.Vector3(-4,4,0), isFree: true},
      {pos :new THREE.Vector3(-8,4,0), isFree: true},
      {pos :new THREE.Vector3(8,4,0), isFree: true},
      {pos :new THREE.Vector3(-12,4,0), isFree: true},
      {pos :new THREE.Vector3(12,4,0), isFree: true},
      {pos :new THREE.Vector3(0,-4,0), isFree: true},
      {pos :new THREE.Vector3(-4,-4,0), isFree: true},
      {pos :new THREE.Vector3(4,-4,0), isFree: true},
      {pos :new THREE.Vector3(-8,-4,0), isFree: true},
      {pos :new THREE.Vector3(8,-4,0), isFree: true},
      {pos :new THREE.Vector3(-12,-4,0), isFree: true},
      {pos :new THREE.Vector3(12,-4,0), isFree: true},
  ]
  const zFirstRotation = [
    0.1,0.05,-0.05,-0.1
  ]
  const zSecondRotation = [
    -0.1,-0.05,0.05,0.1
  ]
  const mainCardPosition = new THREE.Vector3(20,0,6);
  const playerRepo = [
    new THREE.Vector3(-20,-8,6),
    new THREE.Vector3(-20,8,6),
  ]
  
  export {
    playersPositions,
    boardPositions,
    zFirstRotation,
    zSecondRotation,
    mainCardPosition,
    playerRepo
}