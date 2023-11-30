import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { createLight, createPlane } from './utils/utilsConstructor';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { changeShape } from './utils/changeShape';
import { Button } from '@chakra-ui/react';
import { onPointerMove } from './utils/onPointerMove';
import _ from 'lodash';

const Threejs = () => {
  let shapeName = 'plane';
  let points = [];
  let control;
  let isDraw = false;
  let excludeObjects = [];
  const size = 1000;
  const divisions = 1000;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
  scene.fog = new THREE.Fog(fogColor, 1, 70);

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
  function animate() {
    requestAnimationFrame(animate);
    orbit.update();
    render();
  }

  //handle
  function handleKeyPress(event) {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
      // Toggle the value of isDraw
      if (isDraw) {
        points = [];
      }
      isDraw = !isDraw;
    }

    if (event.key === ' ') {
      control.detach(shape);
    }
  }

  animate();

  //event listener
  window.addEventListener(
    'mousemove',
    _.throttle((event) => {
      onPointerMove(event, camera, scene, excludeObjects, isDraw, points);
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
      <Button
        onClick={() => {
          shapeName = changeShape('box', shapeName, scene, control);
        }}
      >
        box
      </Button>
      <Button
        onClick={() => {
          shapeName = changeShape('plane', shapeName, scene, control);
        }}
      >
        plane
      </Button>
      <Button
        onClick={() => {
          changeShape('sphere', shapeName, scene, control);
        }}
      >
        sphere
      </Button>
    </>
  );
};

export default Threejs;
