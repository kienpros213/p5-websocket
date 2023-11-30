import * as THREE from 'three';

export function Box() {
  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: '#34aeeb' });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  return box;
}

export function Plane() {
  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb',
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  return plane;
}

export function Sphere() {
  const sphereGeometry = new THREE.SphereGeometry(3, 64, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb'
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return sphere;
}
