import { MathUtils } from 'three';

export function shapeRotation(rotation, scene, direction, controlTarget) {
  const newRotation = MathUtils.degToRad(rotation);
  const convertedRotation = newRotation;
  const { x, y, z } = controlTarget.rotation;

  switch (direction) {
    case 'x':
      controlTarget.rotation.set(convertedRotation, y, z);
      break;
    case 'y':
      controlTarget.rotation.set(x, convertedRotation, z);
      break;
    case 'z':
      controlTarget.rotation.set(x, y, convertedRotation);
      break;
    case 'all':
      controlTarget.rotation.set(0, 0, 0);
  }
}
