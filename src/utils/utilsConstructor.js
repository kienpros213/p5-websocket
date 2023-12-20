import * as THREE from 'three';

export function createLight() {
  const light = new THREE.AmbientLight(0x404040); // soft white light
  return light;
}

export function createCube(width, height, depth, color) {
  const boxGeometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const cube = new THREE.Mesh(boxGeometry, material);
  return cube;
}

export function createPlane(width, height, color) {
  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.renderOrder = 2;
  return plane;
}
