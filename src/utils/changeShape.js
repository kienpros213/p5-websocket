import { shapeFactory } from './shapeFactory';

export function changeShape(targetShape, shapeName, scene, control) {
  //check if the shape is already exist
  let existingShape;
  //get the current shape on the world
  let currentShape;
  switch (targetShape) {
    case 'box':
      currentShape = scene.getObjectByName(shapeName);
      existingShape = scene.getObjectByName('box');
      shapeName = 'box';
      if (existingShape) {
        existingShape.geometry.dispose();
        scene.remove(existingShape);
      } else {
        currentShape.geometry.dispose();
        scene.remove(currentShape);
      }
      const newBox = shapeFactory(shapeName);
      newBox.name = 'box';
      scene.add(newBox);
      control.attach(newBox);
      break;

    case 'plane':
      currentShape = scene.getObjectByName(shapeName);
      existingShape = scene.getObjectByName('plane');
      shapeName = 'plane';
      if (existingShape) {
        existingShape.geometry.dispose();
        scene.remove(existingShape);
      } else {
        currentShape.geometry.dispose();
        scene.remove(currentShape);
      }

      const newPlane = shapeFactory(shapeName);
      newPlane.name = 'plane';
      scene.add(newPlane);
      control.attach(newPlane);
      break;

    case 'sphere':
      currentShape = scene.getObjectByName(shapeName);
      existingShape = scene.getObjectByName('sphere');
      shapeName = 'sphere';
      if (existingShape) {
        existingShape.geometry.dispose();
        scene.remove(existingShape);
      } else {
        currentShape.geometry.dispose();
        scene.remove(currentShape);
      }

      const newSphere = shapeFactory(shapeName);
      newSphere.name = 'sphere';
      scene.add(newSphere);
      control.attach(newSphere);
      break;

    default:
      console.log('Unsupported shape:', targetShape);
  }
  return shapeName;
}
