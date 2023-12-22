import * as THREE from 'three';
import _ from 'lodash';
import HelpModal from './components/HelpModal';
import CameraControls from 'camera-controls';
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
import { useEffect, useRef, useState } from 'react';
import {
  handleMouseUp,
  handleKeyUp,
  handleKeyDown,
  handlePenDraw,
  handleDrag,
  handleDrop,
  controlChange
} from './threeUtils/eventControls';
import { shapeRotation } from './threeUtils/shapeRotation';
import { useCameraPlane } from './threeUtils/useCameraPlane';
import { restoreFunction } from './threeUtils/restoreFunction';
import PropTypes from 'prop-types'; // ES6
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

CameraControls.install({ THREE: THREE });

const Threejs = (props) => {
  const clock = new THREE.Clock();
  const [rotation, setRotation] = useState(90);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let shapeName = useRef('plane');
  let scene = useRef();
  let control = useRef();
  let socket = useRef();
  let room = useRef();
  let lineMesh = useRef();
  let cameraControls = useRef();
  let excludeObjects = useRef([]);
  let recievedPoints = useRef([]);
  let camera = useRef();
  let controlTarget = useRef();
  const { xPlane, yPlane, zPlane, reverseXPlane, reverseYPlane, reverseZPlane } = useCameraPlane();
  let isDraw = false;
  let points = [];
  const size = 1000;
  const divisions = 1000;
  let penTool = false;

  useEffect(() => {
    socket.current = props.socket;
    room.current = props.room;
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.current.position.z = 8;
    camera.current.position.y = 8;
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
    control.current = new TransformControls(camera.current, renderer.domElement);
    control.current.attach(shape);

    //orbit control
    cameraControls.current = new CameraControls(camera.current, renderer.domElement);
    cameraControls.current.mouseButtons.left = CameraControls.ACTION.NONE;

    //fog
    const fogColor = new THREE.Color(0xffffff);
    scene.current.background = fogColor;
    scene.current.fog = new THREE.Fog(fogColor, 1, 50);

    //add stuff
    scene.current.add(shape, gridHelper, light, control.current);
    excludeObjects.current.push(control.current, gridHelper);

    //render function
    function render() {
      renderer.render(scene.current, camera.current);
    }

    //socket function
    if (props.socket) {
      let receivedChunks = [];

      props.socket.on(
        'serverFreeDraw',
        _.throttle((payload) => {
          threeSocketListener(scene.current, payload, recievedPoints.current);
        }, 1000 / 120)
      );

      props.socket.on('serverStopFreeDraw', (payload) => {
        const existObject = recievedPoints.current.find((obj) => obj.id === payload);
        existObject.data = [];
      });

      props.socket.on('roomJoined', (payload) => {
        const drawData = payload.drawState;
        restoreFunction(scene.current, drawData);
      });

      props.socket.on('serverLoadModel', (payload) => {
        // Assuming payload is an ArrayBuffer
        console.log(payload.byteLength);
        receivedChunks.push(payload.data);
        const combinedBuffer = concatMultipleArrayBuffers(...receivedChunks);
        console.log(combinedBuffer);
        if (combinedBuffer.byteLength === payload.byteLength) {
          console.log('done');

          const draco = new DRACOLoader();
          draco.setDecoderPath('../examples/js/libs/draco/gltf/');

          var loader = new GLTFLoader();
          loader.setDRACOLoader(draco);
          loader.parse(combinedBuffer, '', function (result) {
            var model = result.scene;
            model.name = payload.fileName;
            const box3 = new THREE.Box3();
            const size = new THREE.Vector3();

            const pointLight = new THREE.PointLight(0xffffff, 20, 100);
            pointLight.position.set(0, 5, 0);

            box3.setFromObject(model);
            box3.getSize(size);
            const max = Math.max(size.x, size.y, size.z);
            model.scale.setScalar(1 / max);

            scene.current.add(pointLight);
            scene.current.add(result.scene);

            receivedChunks = [];
          });
        }
      });

      props.socket.on('serverTransfrom', (payload) => {
        const currentShape = scene.current.getObjectByName(payload.name);
        const { xP, yP, zP } = payload.position;
        const { xR, yR, zR } = payload.rotation;
        const { xS, yS, zS } = payload.scale;
        currentShape.position.set(xP, yP, zP);
        currentShape.rotation.set(xR, yR, zR);
        currentShape.scale.set(xS, yS, zS);
      });
    }

    function concatMultipleArrayBuffers(...buffers) {
      const totalLength = buffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
      const result = new ArrayBuffer(totalLength);
      let offset = 0;
      for (const buffer of buffers) {
        const view = new Uint8Array(result, offset, buffer.byteLength);
        view.set(new Uint8Array(buffer));
        offset += buffer.byteLength;
      }
      return result;
    }

    function animate() {
      const delta = clock.getDelta();
      cameraControls.current.update(delta);
      requestAnimationFrame(animate);
      render();
    }

    animate();

    control.current.addEventListener(
      'change',
      _.throttle(() => {
        controlChange(controlTarget.current, socket.current, render, room.current);
      }, 200)
    );

    //clean up
    return () => {
      // Dispose of the renderer, event listeners, and transform control
      if (props.socket) {
        props.socket.off('roomJoined');
        props.socket.off('serverFreeDraw');
        props.socket.off('serverStopFreeDraw');
        props.socket.off('serverLoadModel');
      }
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
      control.current.dispose();
      control.current.removeEventListener('change', controlChange);
    };
  }, [props.socket, props.room, clock]);

  useEffect(() => {
    //mouse move
    window.addEventListener(
      'mousemove',
      _.throttle((e) => {
        onPointerMove(
          e,
          camera.current,
          scene.current,
          excludeObjects.current,
          isDraw,
          points,
          socket.current,
          lineMesh.current,
          room.current
        );
      }, 1000 / 120)
    );
    //key down
    window.addEventListener('keydown', (e) => {
      const result = handleKeyDown(
        e,
        control.current,
        cameraControls.current,
        CameraControls,
        isDraw,
        scene.current,
        shapeName.current,
        socket.current,
        room.current,
        points,
        lineMesh.current,
        xPlane.current,
        yPlane.current,
        zPlane.current,
        reverseXPlane.current,
        reverseYPlane.current,
        reverseZPlane.current,
        penTool
      );
      isDraw = result.isDraw;
      points = result.points;
      lineMesh.current = result.lineMesh;
      penTool = result.penTool;
    });
    //key up
    window.addEventListener('keyup', (e) => {
      handleKeyUp(e, cameraControls.current, CameraControls);
    });
    //mouse down
    window.addEventListener('mousedown', (e) => {
      const newControlTarget = handlePenDraw(
        e,
        camera.current,
        scene.current,
        excludeObjects.current,
        penTool,
        socket.current,
        room.current,
        control.current,
        controlTarget.current
      );

      controlTarget.current = newControlTarget;
    });
    //mouse up
    window.addEventListener('mouseup', () => {
      handleMouseUp(
        scene.current,
        shapeName.current,
        xPlane.current,
        yPlane.current,
        zPlane.current,
        reverseXPlane.current,
        reverseYPlane.current,
        reverseZPlane.current
      );
    });
    //drag
    window.addEventListener(
      'dragover',
      (e) => {
        handleDrag(e);
      },
      false
    );
    //drop
    window.addEventListener(
      'drop',
      (e) => {
        handleDrop(e, scene.current, socket.current, room.current);
      },
      false
    );
    //clean up
    return () => {
      window.removeEventListener('mousedown', handlePenDraw);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dragover', handleDrag);
      window.removeEventListener('drop', handleDrop);
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
          <Divider />
          {/* reverse rotation button */}
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(reverseXPlane.current, cameraControls.current);
            }}
            icon={<FontAwesomeIcon icon={faX} />}
          ></IconButton>
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(reverseYPlane.current, cameraControls.current);
            }}
            icon={<FontAwesomeIcon icon={faY} />}
          ></IconButton>
          <IconButton
            bg="#f23350"
            onClick={() => {
              fitToRect(reverseZPlane.current, cameraControls.current);
            }}
            icon={<FontAwesomeIcon icon={faZ} />}
          ></IconButton>
        </VStack>
      </Box>
      <HelpModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

Threejs.propTypes = { socket: PropTypes.any, room: PropTypes.any };

export default Threejs;
