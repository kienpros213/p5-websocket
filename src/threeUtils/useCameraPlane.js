import * as THREE from 'three';
import { MathUtils } from 'three';
import { useRef } from 'react';

export function useCameraPlane() {
  const newRotation = MathUtils.degToRad(90);
  const convertedRotation = newRotation;

  let xPlane = useRef();
  let yPlane = useRef();
  let zPlane = useRef();

  let reverseXPlane = useRef();
  let reverseYPlane = useRef();
  let reverseZPlane = useRef();

  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#d62222',
    side: THREE.DoubleSide,
    transparent: true
  });
  xPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);
  yPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);
  zPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);

  //red
  xPlane.current.position.set(6, 0, 0);
  xPlane.current.rotation.set(0, -convertedRotation, 0);

  //blue
  yPlane.current.position.set(0, 6, 0);
  yPlane.current.rotation.set(convertedRotation, 0, 0);

  //green
  zPlane.current.position.set(0, 0, 6);
  zPlane.current.rotation.set(0, 2 * convertedRotation, 0);

  reverseXPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);
  reverseYPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);
  reverseZPlane.current = new THREE.Mesh(planeGeometry, planeMaterial);

  reverseXPlane.current.position.set(-6, 0, 0);
  reverseXPlane.current.rotation.set(0, convertedRotation, 0);

  reverseYPlane.current.position.set(0, -6, 0);
  reverseYPlane.current.rotation.set(-convertedRotation, 0, 0);

  reverseZPlane.current.position.set(0, 0, -6);
  reverseZPlane.current.rotation.set(0, 0, 0);
  return { xPlane, yPlane, zPlane, reverseXPlane, reverseYPlane, reverseZPlane };
}
