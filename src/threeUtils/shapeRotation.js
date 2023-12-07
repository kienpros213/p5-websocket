import { MathUtils } from 'three';

export function shapeRotation(rotation, scene, direction, shapeName) {
  console.log(scene);
  const newRotation = MathUtils.degToRad(rotation);
  const convertedRotation = newRotation;
  const currentShape = scene.getObjectByName(shapeName);
  const { x, y, z } = currentShape.rotation;

  switch (direction) {
    case 'x':
      currentShape.rotation.set(convertedRotation, y, z);
      break;
    case 'y':
      currentShape.rotation.set(x, y, convertedRotation);
      break;
    case 'z':
      currentShape.rotation.set(x, convertedRotation, z);
      break;
  }
}