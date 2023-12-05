import * as THREE from 'three';
import { io } from 'socket.io-client';
import _ from 'lodash';
import { VStack, Box, IconButton, Divider, useDisclosure } from '@chakra-ui/react';
import { BoxFill, CircleFill, SquareFill, QuestionLg } from 'react-bootstrap-icons';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createLight, createPlane } from './utils/utilsConstructor';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { changeShape } from './utils/changeShape';
import { onPointerMove } from './utils/onPointerMove';
import { threeSocketListener } from './threeUtils/threeSocketListener';
import HelpeModal from './components/HelpModal';

const socket = io('ws://localhost:3000');
socket.on('connect', () => {
  console.log('WebSocket connected');
});

const Threejs = () => {
  let shapeName = 'plane';
  let points = [];
  let recievedPoints = [];
  let control;
  let isDraw = false;
  let excludeObjects = [];
  const size = 1000;
  const divisions = 1000;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  //transform control
  control = new TransformControls(camera, renderer.domElement);
  control.attach(shape);

  //orbit control
  const orbit = new OrbitControls(camera, renderer.domElement);

  //fog
  const fogColor = new THREE.Color(0xffffff);
  scene.background = fogColor;
  scene.fog = new THREE.Fog(fogColor, 1, 50);

  //add stuff
  scene.add(shape, gridHelper, light, control);
  camera.position.z = 8;
  orbit.update();
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
    requestAnimationFrame(animate);
    orbit.update();
    render();
  }

  //handle
  function handleKeyPress(event) {
    // Check if the pressed key is 'Enter'
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

  animate();

  //event listener
  window.addEventListener(
    'mousemove',
    _.throttle((event) => {
      onPointerMove(event, camera, scene, excludeObjects, isDraw, points, socket);
    }, 1000 / 120)
  );
  window.addEventListener('keydown', handleKeyPress);
  control.addEventListener('change', render);
  control.addEventListener('dragging-changed', function (event) {
    orbit.enabled = !event.value;
  });
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
        </VStack>
      </Box>

      <HelpeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

export default Threejs;
