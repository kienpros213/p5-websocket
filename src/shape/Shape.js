import * as THREE from 'three';

export function Box() {
  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb',
    transparent: true,
    opacity: 0.7
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  return box;
}

export function Plane() {
  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  return plane;
}

export function Sphere() {
  const sphereGeometry = new THREE.SphereGeometry(3, 64, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb',
    transparent: true,
    opacity: 0.7
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return sphere;
}

export function Cone() {
  const coneGeometry = new THREE.ConeGeometry(3, 5, 32);
  const coneMaterial = new THREE.MeshStandardMaterial({
    color: '#34aeeb',
    transparent: true,
    opacity: 0.7
  });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  return cone;
}
