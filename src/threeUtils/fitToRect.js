import * as THREE from 'three';

const _centerPosition = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _cameraPosition = new THREE.Vector3();

export function fitToRect(rect, cameraControls) {
  const rectWidth = rect.geometry.parameters.width;
  const rectHeight = rect.geometry.parameters.height;

  rect.updateMatrixWorld();
  const rectCenterPosition = _centerPosition.copy(rect.position);
  const rectNormal = _normal.set(0, 0, 1).applyQuaternion(rect.quaternion);
  const distance = cameraControls.getDistanceToFitBox(rectWidth, rectHeight, 0);
  const cameraPosition = _cameraPosition.copy(rectNormal).multiplyScalar(-distance).add(rectCenterPosition);

  cameraControls.setLookAt(
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z,
    rectCenterPosition.x,
    rectCenterPosition.y,
    rectCenterPosition.z,
    true
  );
}
