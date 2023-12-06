import * as THREE from 'three';

export function cameraPlane(color) {
  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  return plane;
}
