import { fitToRect } from './fitToRect';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { loadFiles } from './loadFiles';

let reverseState = false;
let changeControl = true;
let lineArray = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let drawPos = new THREE.Vector3();
let controlTarget;

const handlePenDraw = (event, camera, scene, excludeObjects, penTool, socket, room, control) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children.filter((obj) => !excludeObjects.includes(obj)));

  if (intersects.length > 0) {
    console.log('detect');
    if (changeControl) {
      const newObj = intersects[0].object;
      if (newObj.name === 'plane') {
        control.attach(newObj);
        controlTarget = newObj;
      }
      newObj.traverseAncestors((obj) => {
        if (obj.isGroup) {
          control.attach(obj);
          console.log(obj.name);
          controlTarget = obj;
        }
      });
    }

    if (penTool && lineArray.length <= 2) {
      drawPos = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
      lineArray.push(drawPos);
      if (lineArray.length === 2) {
        const geometry = new LineGeometry();
        geometry.setPositions(lineArray.flat());

        const material = new LineMaterial({
          color: 'red',
          linewidth: 0.005
        });

        const Line = new Line2(geometry, material);
        scene.add(Line);

        if (socket) {
          socket.emit('penDraw', { drawPos: lineArray, room: room });
        }

        lineArray = [];
        console.log('clear', lineArray);
        lineArray.push(drawPos);
      }
    }
  }
  if (controlTarget) {
    return controlTarget;
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
      }
      if (!reverseState) {
        fitToRect(reverseXPlane, cameraControls);
      }
      break;
    case 67: //C
      if (reverseState) {
        fitToRect(yPlane, cameraControls);
      }
      if (!reverseState) {
        fitToRect(reverseYPlane, cameraControls);
      }
      break;
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
    case 13: {
      //Enter
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
          socket.emit('stopFreeDraw', room);
        }
      }
      break;
    }

    case 17: //Cltr
      penTool = !penTool;
      changeControl = !changeControl;
      lineArray = [];
      if (penTool) {
        control.detach(currentShape);
      }
      if (!penTool) {
        control.attach(currentShape);
        if (socket) {
          socket.emit('stopFreeDraw', room);
        }
      }
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

const handleDrag = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

const handleDrop = (event, scene, socket, control) => {
  event.preventDefault();
  loadFiles(event.dataTransfer.files, scene, socket);
};

const controlChange = (controlTarget, socket, render) => {
  if (controlTarget && socket) {
    const name = controlTarget.name;
    const position = { xP: controlTarget.position.x, yP: controlTarget.position.y, zP: controlTarget.position.z };
    const rotation = { xR: controlTarget.rotation.x, yR: controlTarget.rotation.y, zR: controlTarget.rotation.z };
    const scale = { xS: controlTarget.scale.x, yS: controlTarget.scale.y, zS: controlTarget.scale.z };
    socket.emit('transform', { name: name, position: position, rotation: rotation, scale: scale });
  }
  render();
};

export { handleMouseUp, handleKeyDown, handleKeyUp, handlePenDraw, handleDrag, handleDrop, controlChange };
