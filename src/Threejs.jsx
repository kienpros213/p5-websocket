import * as THREE from 'three';
import { MathUtils } from 'three';
import _ from 'lodash';
import HelpModal from './components/HelpModal';
import CameraControls from 'camera-controls';
import { io } from 'socket.io-client';
import { VStack, Box, IconButton, Divider, useDisclosure, HStack, Input } from '@chakra-ui/react';
import {
  BoxFill,
  CircleFill,
  SquareFill,
  QuestionLg,
  ArrowCounterclockwise,
  TriangleFill
} from 'react-bootstrap-icons';
import { createLight, createPlane } from './utils/utilsConstructor';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { changeShape } from './utils/changeShape';
import { onPointerMove } from './utils/onPointerMove';
import { threeSocketListener } from './threeUtils/threeSocketListener';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faY, faZ } from '@fortawesome/free-solid-svg-icons';
import { fitToRect } from './threeUtils/fitToRect';
import { cameraPlane } from './threeUtils/cameraPlane';
import { useEffect, useRef, useState } from 'react';
import { handleMouseUp, handleKeyUp, handleKeyDown } from './threeUtils/eventControls';
import { shapeRotation } from './threeUtils/shapeRotation';

CameraControls.install({ THREE: THREE });

const socket = io('ws://localhost:3000');
socket.on('connect', () => {
  console.log('WebSocket connected');
});

const Threejs = () => {
  const clock = new THREE.Clock();
  const [rotation, setRotation] = useState(30);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let shapeName = useRef('plane');
  let scene = useRef();
  let points = [];
  let excludeObjects = [];
  let recievedPoints = [];
  let control = useRef();
  let isDraw = useRef(false);
  let cameraControls = useRef();
  const size = 1000;
  const divisions = 1000;
  let xPlane = useRef();
  let yPlane = useRef();
  let zPlane = useRef();
  useEffect(() => {
    scene.current = new THREE.Scene();
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

    const newRotation = MathUtils.degToRad(90);
    const convertedRotation = newRotation;

    //red
    xPlane.current = cameraPlane('#d62222');
    xPlane.current.position.set(6, 0, 0);
    xPlane.current.rotation.set(0, -convertedRotation, 0);
    //blue
    yPlane.current = cameraPlane('#1c12a3');
    yPlane.current.position.set(0, 6, 0);
    yPlane.current.rotation.set(convertedRotation, 0, 0);

    //green
    zPlane.current = cameraPlane('#23db39');
    zPlane.current.position.set(0, 0, 6);
    zPlane.current.rotation.set(0, 2 * convertedRotation, 0);

    //transform control
    control.current = new TransformControls(camera, renderer.domElement);
    control.current.attach(shape);

    //orbit control
    cameraControls.current = new CameraControls(camera, renderer.domElement);
    cameraControls.current.mouseButtons.left = CameraControls.ACTION.NONE;

    //fog
    const fogColor = new THREE.Color(0xffffff);
    scene.current.background = fogColor;
    scene.current.fog = new THREE.Fog(fogColor, 1, 50);

    //add stuff
    scene.current.add(shape, gridHelper, light, control.current);
    excludeObjects.push(control.current, gridHelper);

    //render function
    function render() {
      renderer.render(scene.current, camera);
    }

    //update function
    socket.on(
      'serverThree',
      _.throttle((payload) => {
        threeSocketListener(scene.current, payload, recievedPoints);
      }, 1000 / 120)
    );

    socket.on('serverStopDraw', (payload) => {
      console.log(payload);
      const existObject = recievedPoints.find((obj) => obj.id === payload);
      existObject.data = [];
    });

    function animate() {
      const delta = clock.getDelta();
      cameraControls.current.update(delta);
      requestAnimationFrame(animate);
      render();
    }

    animate();

    //mouse move
    window.addEventListener(
      'mousemove',
      _.throttle((e) => {
        onPointerMove(e, camera, scene.current, excludeObjects, isDraw.current, points, socket);
      }, 1000 / 120)
    );
    //key down
    window.addEventListener('keydown', (e) => {
      const { isDraw: newIsDraw, points: newPoints } = handleKeyDown(
        e,
        control.current,
        cameraControls.current,
        CameraControls,
        isDraw.current,
        scene.current,
        shapeName.current,
        socket,
        points
      );
      isDraw.current = newIsDraw;
      points = newPoints;
    });
    //key up
    window.addEventListener('keyup', (e) => {
      handleKeyUp(e, cameraControls.current, CameraControls);
    });
    //mouse up
    window.addEventListener('mouseup', () => {
      handleMouseUp(scene.current, shapeName.current, xPlane.current, yPlane.current, zPlane.current);
    });
    control.current.addEventListener('change', render);

    //dispose
    return () => {
      //dispose threejs component
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
      control.current.dispose();
      scene.current.remove(shape, gridHelper, light, control.current);

      //remove event listener
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // window.removeEventListener('mouseup', handleMouseUp);
      control.current.removeEventListener('change', render);
    };
  }, []);

  ////////////// UI ////////////////
  return (
    <>
      <Box display="flex" justifyContent="center">
        <Box position="absolute" backgroundColor="#081924" w="280px" m="10px" borderRadius="10px">
          <HStack p="10px">
            <IconButton
              onClick={() => {
                shapeRotation(rotation, scene.current, 'all', shapeName.current);
              }}
              icon={<ArrowCounterclockwise />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, scene.current, 'x', shapeName.current);
              }}
              icon={<FontAwesomeIcon icon={faX} />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, scene.current, 'y', shapeName.current);
              }}
              icon={<FontAwesomeIcon icon={faY} />}
            ></IconButton>
            <IconButton
              onClick={() => {
                shapeRotation(rotation, scene.current, 'z', shapeName.current);
              }}
              icon={<FontAwesomeIcon icon={faZ} />}
            ></IconButton>
            <Input
              value={rotation}
              onChange={(e) => {
                setRotation(e.target.value);
                console.log(shapeName.current);
              }}
              textAlign="center"
              backgroundColor="white"
            ></Input>
          </HStack>
        </Box>
      </Box>
      <Box pos="absolute" m="10px" p="10px" backgroundColor="#081924" borderRadius="10px">
        <VStack>
          <IconButton icon={<QuestionLg />} onClick={onOpen}></IconButton>
          <Divider />
          {/* shape button */}
          <IconButton
            icon={<BoxFill />}
            onClick={() => {
              shapeName.current = changeShape('box', shapeName.current, scene.current, control.current);
            }}
          ></IconButton>
          <IconButton
            icon={<SquareFill />}
            onClick={() => {
              shapeName.current = changeShape('plane', shapeName.current, scene.current, control.current);
            }}
          ></IconButton>
          <IconButton
            icon={<CircleFill />}
            onClick={() => {
              shapeName.current = changeShape('sphere', shapeName.current, scene.current, control.current);
            }}
          ></IconButton>
          <IconButton
            icon={<TriangleFill />}
            onClick={() => {
              shapeName.current = changeShape('cone', shapeName.current, scene.current, control.current);
            }}
          ></IconButton>
          {/* rotation button */}
          <Divider />
          <IconButton
            onClick={() => {
              fitToRect(xPlane.current, cameraControls.current);
            }}
            icon={<FontAwesomeIcon icon={faX} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              fitToRect(yPlane.current, cameraControls.current);
            }}
            icon={<FontAwesomeIcon icon={faY} />}
          ></IconButton>
          <IconButton
            onClick={() => {
              fitToRect(zPlane.current, cameraControls.current);
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
