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

//mosue down
const handlePenDraw = (event, camera, scene, excludeObjects, penTool, socket, room, control) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children.filter((obj) => !excludeObjects.includes(obj)));

  if (intersects.length > 0) {
    const newObj = intersects[0].object;
    console.log(newObj);
    if (
      (changeControl && newObj.name === 'plane') ||
      newObj.name === 'box' ||
      newObj.name === 'cone' ||
      newObj.name === 'sphere'
    ) {
      control.attach(newObj);
      controlTarget = newObj;
    }
    newObj.traverseAncestors((obj) => {
      if (obj.isGroup) {
        control.attach(obj);
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
      lineArray.push(drawPos);
    }
  }
  if (controlTarget) {
    return controlTarget;
  }
};

//mouse up
const handleMouseUp = (
  xPlane,
  yPlane,
  zPlane,
  reverseXPlane,
  reverseYPlane,
  reverseZPlane,
  controlTarget,
  socket,
  room
) => {
  if (controlTarget && socket && controlTarget.isGroup) {
    const name = controlTarget.name;
    const position = { xP: controlTarget.position.x, yP: controlTarget.position.y, zP: controlTarget.position.z };
    const rotation = { xR: controlTarget.rotation.x, yR: controlTarget.rotation.y, zR: controlTarget.rotation.z };
    const scale = { xS: controlTarget.scale.x, yS: controlTarget.scale.y, zS: controlTarget.scale.z };
    //set camera plane new position
    xPlane.position.set(position.xP + 6, position.yP, position.zP);
    yPlane.position.set(position.xP, position.yP + 6, position.zP);
    zPlane.position.set(position.xP, position.yP, position.zP + 6);
    reverseXPlane.position.set(position.xP + -6, position.yP, position.zP);
    reverseYPlane.position.set(position.xP, position.yP + -6, position.zP);
    reverseZPlane.position.set(position.xP, position.yP, position.zP + -6);

    socket.emit('endTransform', { name: name, room: room, position: position, rotation: rotation, scale: scale });
  }
};

//key down
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

//key up
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

//drag
const handleDrag = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

//drop
const handleDrop = (event, scene, socket, room) => {
  event.preventDefault();
  loadFiles(event.dataTransfer.files, scene, socket, room);
};

//control
const controlChange = (controlTarget, socket, render, room) => {
  if (controlTarget && socket) {
    const name = controlTarget.name;
    const position = { xP: controlTarget.position.x, yP: controlTarget.position.y, zP: controlTarget.position.z };
    const rotation = { xR: controlTarget.rotation.x, yR: controlTarget.rotation.y, zR: controlTarget.rotation.z };
    const scale = { xS: controlTarget.scale.x, yS: controlTarget.scale.y, zS: controlTarget.scale.z };
    socket.emit('transform', { room: room, name: name, position: position, rotation: rotation, scale: scale });
  }
};

export { handleMouseUp, handleKeyDown, handleKeyUp, handlePenDraw, handleDrag, handleDrop, controlChange };
