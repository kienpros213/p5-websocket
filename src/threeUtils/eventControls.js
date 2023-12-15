import { fitToRect } from './fitToRect';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import _ from 'lodash';

let reverseState = false;

const handleMouseUp = (scene, shapeName, xPlane, yPlane, zPlane, reverseXPlane, reverseYPlane, reverseZPlane) => {
  const currentShape = scene.getObjectByName(shapeName);
  const { x, y, z } = currentShape.position;
  xPlane.position.set(x + 6, y, z);
  yPlane.position.set(x, y + 6, z);
  zPlane.position.set(x, y, z + 6);
  reverseXPlane.position.set(x + -6, y, z);
  reverseYPlane.position.set(x, y + -6, z);
  reverseZPlane.position.set(x, y, z + -6);
};

const handleKeyDown = (
  event,
  control,
  cameraControls,
  CameraControls,
  isDraw,
  scene,
  shapeName,
  socket,
  points,
  lineMesh,
  xPlane,
  yPlane,
  zPlane,
  reverseXPlane,
  reverseYPlane,
  reverseZPlane
) => {
  switch (event.keyCode) {
    case 87: // W
      control.setMode('translate');
      break;
    case 69: // E
      control.setMode('rotate');
      break;
    case 82: // R
      control.setMode('scale');
      break;
    case 88: //X
      console.log('x');
      if (reverseState) {
        fitToRect(xPlane, cameraControls);
        break;
      }
      if (!reverseState) {
        fitToRect(reverseXPlane, cameraControls);
        break;
      }
    case 67: //C
      if (reverseState) {
        fitToRect(yPlane, cameraControls);
        break;
      }
      if (!reverseState) {
        fitToRect(reverseYPlane, cameraControls);
        break;
      }
    case 90: //Z
      if (reverseState) {
        fitToRect(zPlane, cameraControls);
        break;
      }
      if (!reverseState) {
        fitToRect(reverseZPlane, cameraControls);
        break;
      }
      break;
    case 18: //Alt
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
      break;
    case 16: //Shift
      reverseState = true;
      break;
    case 13: //Enter
      isDraw = !isDraw;
      const currentShape = scene.getObjectByName(shapeName);

      const drawLine = new MeshLineGeometry();
      const drawLineMaterial = new MeshLineMaterial({
        color: '#eb4034',
        lineWidth: 0.1
      });
      drawLineMaterial.polygonOffset = true;
      drawLineMaterial.polygonOffsetUnit = 1;
      drawLineMaterial.polygonOffsetFactor = 1;
      drawLineMaterial.blending = THREE.NormalBlending;

      const drawLineMesh = new THREE.Mesh(drawLine, drawLineMaterial);
      drawLineMesh.renderOrder = 1;
      lineMesh = drawLine;
      scene.add(drawLineMesh);

      if (isDraw) {
        points = [];
        control.detach(currentShape);

        socket.emit('clientStartDraw');
      }
      if (!isDraw) {
        control.attach(currentShape);
        socket.emit('clientStopDraw');
      }
  }
  return { isDraw, points, lineMesh };
};

const handleKeyUp = (event, cameraControls, CameraControls) => {
  switch (event.keyCode) {
    case 18: //Alt
      cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
      break;
    case 16: // Shift
      reverseState = false;
      break;
  }
};

export { handleMouseUp, handleKeyDown, handleKeyUp };
