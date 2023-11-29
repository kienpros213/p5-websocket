import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { createLight, createCube, createPlane } from './utils/utilsConstructor';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { shapeFactory } from './utils/shapeFactory';
import _ from 'lodash';

const Threejs = () => {
  let control;
  let isDraw = false;
  let excludeObjects = [];
  let drawPos = new THREE.Vector3();
  let currentShape = 'plane';
  const size = 1000;
  const divisions = 1000;
  const points = [];
  const plainRotation = THREE.MathUtils.degToRad(0);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //orbit control
  const orbit = new OrbitControls(camera, renderer.domElement);
  //grid helper
  const gridHelper = new THREE.GridHelper(size, divisions);
  //light
  const light = createLight(0xffffff, 10);
  //mesh
  const shape = shapeFactory(currentShape);
  //line geometry
  const drawLine = new MeshLineGeometry();
  const drawLineMaterial = new MeshLineMaterial({
    color: '#eb4034',
    lineWidth: 0.1
  });
  const drawLineMesh = new THREE.Mesh(drawLine, drawLineMaterial);
  //transform control
  control = new TransformControls(camera, renderer.domElement);
  control.attach(shape);

  //fog
  const fogColor = new THREE.Color(0xffffff);
  scene.background = fogColor; // Setting fogColor as the background color also
  scene.fog = new THREE.Fog(fogColor, 1, 70);

  //add stuff
  scene.add(shape, gridHelper, light, drawLineMesh, control);
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

  //calculate raycaster function
  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children.filter((obj) => !excludeObjects.includes(obj)));
    if (intersects.length > 0) {
      console.log(intersects);
      drawPos = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z + 0.1];
    }

    if (isDraw) {
      console.log(intersects.length);
      points.push(drawPos);
      drawLine.setPoints(points.flat());
    }
  }

  //handle
  function handleKeyPress(event) {
    // Check if the pressed key is 'Enter'
    if (event.key === 'Enter') {
      // Toggle the value of isDraw
      isDraw = !isDraw;
      console.log(isDraw);
    }

    if (event.key === ' ') {
      control.detach(shape);
    }
  }

  animate();

  //event listener
  window.addEventListener('mousemove', _.throttle(onPointerMove, 1000 / 120));
  window.addEventListener('keydown', handleKeyPress);
  control.addEventListener('change', render);
  control.addEventListener('dragging-changed', function (event) {
    orbit.enabled = !event.value;
  });

  return (
    <button
      onClick={() => {
        currentShape = 'box';
        control.detach(shape);
        scene.remove(shape);
        const newShape = shapeFactory(currentShape);
        scene.add(newShape);
        control.attach(newShape);
      }}
    >
      box
    </button>
  );
};

export default Threejs;
