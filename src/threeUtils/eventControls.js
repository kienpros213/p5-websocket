import { fitToRect } from './fitToRect';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import _ from 'lodash';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

let reverseState = false;
let lineArray = [];

const handlePenDraw = (event, camera, scene, excludeObjects, penTool, socket, room) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let drawPos = new THREE.Vector3();

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children.filter((obj) => !excludeObjects.includes(obj)));
  if (intersects.length > 0) {
    drawPos = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
  }
  if (penTool) {
    if (lineArray.length <= 2) {
      lineArray.push(drawPos);
      console.log('0', lineArray);
      if (lineArray.length === 2) {
        const geometry = new LineGeometry();
        geometry.setPositions(lineArray.flat());

        const material = new LineMaterial({
          color: 'red',
          linewidth: 0.0085
        });

        const myLine = new Line2(geometry, material);
        scene.add(myLine);
        lineArray = [];
        console.log('clear', lineArray);
        lineArray.push(drawPos);
      }
    }
  }
};

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
  room,
  points,
  lineMesh,
  xPlane,
  yPlane,
  zPlane,
  reverseXPlane,
  reverseYPlane,
  reverseZPlane,
  penTool
) => {
  const currentShape = scene.getObjectByName(shapeName);
  const lineGeometry = new MeshLineGeometry();
  const lineMaterial = new MeshLineMaterial({
    color: '#eb4034',
    lineWidth: 0.1
  });
  lineMaterial.polygonOffset = true;
  lineMaterial.polygonOffsetUnit = 1;
  lineMaterial.polygonOffsetFactor = 1;
  lineMaterial.blending = THREE.NormalBlending;
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
      const initLineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
      initLineMesh.renderOrder = 1;
      lineMesh = lineGeometry;
      scene.add(initLineMesh);

      if (isDraw) {
        points = [];
        control.detach(currentShape);
      }
      if (!isDraw) {
        control.attach(currentShape);
        if (socket) {
          socket.emit('clientStopDraw', room);
        }
      }
      break;
    case 17: //Cltr
      penTool = !penTool;
      lineArray = [];
      break;
  }

  return { isDraw, points, lineMesh, penTool };
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

export { handleMouseUp, handleKeyDown, handleKeyUp, handlePenDraw };
