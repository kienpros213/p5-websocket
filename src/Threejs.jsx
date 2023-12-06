import * as THREE from 'three';
import { io } from 'socket.io-client';
import _ from 'lodash';
import { VStack, Box, IconButton, Divider, useDisclosure } from '@chakra-ui/react';
import { BoxFill, CircleFill, SquareFill, QuestionLg } from 'react-bootstrap-icons';
import { createLight, createPlane } from './utils/utilsConstructor';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { changeShape } from './utils/changeShape';
import { onPointerMove } from './utils/onPointerMove';
import { threeSocketListener } from './threeUtils/threeSocketListener';
import HelpModal from './components/HelpModal';
import CameraControls from 'camera-controls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faY, faZ } from '@fortawesome/free-solid-svg-icons';
import { Plane } from './shape/Shape';
import { cameraPlane } from './threeUtils/cameraPlane';

CameraControls.install({ THREE: THREE });

const socket = io('ws://localhost:3000');
socket.on('connect', () => {
  console.log('WebSocket connected');
});

const Threejs = () => {
  const clock = new THREE.Clock();
  let shapeName = 'plane';
  let isRotating = false;
  let points = [];
  let recievedPoints = [];
  let control;
  let isDraw = false;
  let excludeObjects = [];
  const size = 1000;
  const divisions = 1000;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.z = 8;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //grid helper
  const gridHelper = new THREE.GridHelper(size, divisions);

  //light
  const light = createLight(0xffffff, 10);

  //mesh
  const shape = createPlane(5, 5, '#34aeeb');
  shape.name = 'plane';

  //camera plane
  //red
  const xPlane = cameraPlane('#d62222');
  xPlane.position.set(6, 0, 0);
  xPlane.rotation.set(0, -1.57079633, 0);
  //blue
  const yPlane = cameraPlane('#1c12a3');
  yPlane.position.set(0, 0, 6);
  yPlane.rotation.set(0, 3.14159265, 0);

  //green
  const zPlane = cameraPlane('#23db39');
  zPlane.position.set(0, 6, 0);
  zPlane.rotation.set(1.57079633, 0, 0);

  //transform control
  control = new TransformControls(camera, renderer.domElement);
  control.attach(shape);

  //orbit control
  const cameraControls = new CameraControls(camera, renderer.domElement);
  cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;

  //fog
  const fogColor = new THREE.Color(0xffffff);
  scene.background = fogColor;
  scene.fog = new THREE.Fog(fogColor, 1, 50);

  //add stuff
  scene.add(shape, gridHelper, light, control);
  excludeObjects.push(control, gridHelper);

  //render function
  function render() {
    renderer.render(scene, camera);
  }

  //update function
  socket.on(
    'serverThree',
    _.throttle((payload) => {
      threeSocketListener(scene, payload, recievedPoints);
    }, 1000 / 120)
  );

  socket.on('serverStopDraw', (payload) => {
    console.log(payload);
    const existObject = recievedPoints.find((obj) => obj.id === payload);
    existObject.data = [];
  });

  function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
    requestAnimationFrame(animate);
    render();
  }

  //fit to rect function

  const _centerPosition = new THREE.Vector3();
  const _normal = new THREE.Vector3();
  const _cameraPosition = new THREE.Vector3();

  function fitToRect(rect) {
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

  //handle
  function handleMouseUp() {
    const currentShape = scene.getObjectByName(shapeName);
    const { x, y, z } = currentShape.position;
    xPlane.position.set(x + 6, y, z);
    yPlane.position.set(x, y, z + 6);
    zPlane.position.set(x, y + 6, z);
  }

  function handleKeyDown(event) {
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
      case 18: // Alt
        cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        break;
    }

    if (event.key === 'Enter') {
      // Toggle the value of isDraw
      if (isDraw) {
        points = [];
        const currentShape = scene.getObjectByName(shapeName);
        control.attach(currentShape);
        socket.emit('clientStopDraw');
      }
      if (!isDraw) {
        const currentShape = scene.getObjectByName(shapeName);
        control.detach(currentShape);
      }
      isDraw = !isDraw;
    }
  }

  function handleKeyUp(event) {
    switch (event.keyCode) {
      //Alt
      case 18:
        cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
        break;
    }
  }

  animate();

  //event listener
  window.addEventListener(
    'mousemove',
    _.throttle((event) => {
      onPointerMove(event, camera, scene, excludeObjects, isDraw, points, socket);
    }, 1000 / 120)
  );
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('mouseup', handleMouseUp);
  control.addEventListener('change', render);
  ////////////// UI ////////////////
  return (
    <>
      <Box pos="absolute" m="10px" p="10px" backgroundColor="#081924" borderRadius="10px">
        <VStack>
          <IconButton icon={<QuestionLg />} onClick={onOpen}></IconButton>
          <Divider />
          <IconButton
            icon={<BoxFill />}
            onClick={() => {
              shapeName = changeShape('box', shapeName, scene, control);
            }}
          ></IconButton>
          <IconButton
            icon={<SquareFill />}
            onClick={() => {
              shapeName = changeShape('plane', shapeName, scene, control);
            }}
          ></IconButton>
          <IconButton
            icon={<CircleFill />}
            onClick={() => {
              shapeName = changeShape('sphere', shapeName, scene, control);
            }}
          ></IconButton>
          <Divider />
          <IconButton
            onClick={() => {
              // cameraControls.lookInDirectionOf(-3, 0, 0, true);
              fitToRect(xPlane);
            }}
            icon={<FontAwesomeIcon icon={faX} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              // cameraControls.lookInDirectionOf(0, 0, -3, true);
              fitToRect(yPlane);
            }}
            icon={<FontAwesomeIcon icon={faY} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              // cameraControls.lookInDirectionOf(0, -3, 0, true);
              fitToRect(zPlane);
            }}
            icon={<FontAwesomeIcon icon={faZ} />}
          ></IconButton>
        </VStack>
      </Box>
      <HelpModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

export default Threejs;
