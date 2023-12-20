import { Box, Cone, Plane, Sphere } from '../shape/Shape';

export function shapeFactory(shape) {
  switch (shape) {
    case 'box':
      return Box();
    case 'plane':
      return Plane();
    case 'sphere':
      return Sphere();
    case 'cone':
      return Cone();
  }
}
