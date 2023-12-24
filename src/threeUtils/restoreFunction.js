import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export function restoreFunction(scene, drawData) {
  const freeDrawIndex = drawData.freeDraw.shapeIndex;
  const penDrawIndex = drawData.penDraw.shapeIndex;
  const modelIndex = drawData.model.shapeIndex;

  if (freeDrawIndex > 0) {
    for (let i = 0; i < penDrawIndex; i++) {
      penDrawFunction(scene, drawData.penDraw[i]);
    }
  }

  if (penDrawIndex > 0) {
    for (let i = 0; i <= freeDrawIndex; i++) {
      freeDrawFunction(scene, drawData.freeDraw[i]);
    }
  }

  if (modelIndex) {
    console.log(modelIndex);
    for (let i = 0; i < modelIndex; i++) {
      concatenateArrayBuffers(drawData.model[i], scene);
    }
  }
}

function freeDrawFunction(scene, recievedPoints) {
  //line mesh setup
  const drawLine = new MeshLineGeometry();
  const drawLineMaterial = new MeshLineMaterial({
    color: '#eb4034',
    lineWidth: 0.1
  });
  drawLineMaterial.polygonOffset = true;
  drawLineMaterial.polygonOffsetUnit = 10;
  drawLineMaterial.polygonOffsetFactor = 10;
  const drawLineMesh = new THREE.Mesh(drawLine, drawLineMaterial);
  scene.add(drawLineMesh);

  drawLine.setPoints(recievedPoints);
}

function penDrawFunction(scene, recievedPoints) {
  const geometry = new LineGeometry();

  const material = new LineMaterial({
    color: 'red',
    linewidth: 0.005
  });

  const Line = new Line2(geometry, material);
  scene.add(Line);

  geometry.setPositions(recievedPoints.flat(2));
}

function concatenateArrayBuffers(model, scene) {
  const arrayBuffers = model.data;
  const modelName = model.name;
  const position = model.position;
  const rotation = model.rotation;
  const scale = model.scale;

  console.log(position, rotation, scale);

  let totalLength = arrayBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);

  let resultBuffer = new ArrayBuffer(totalLength);

  let resultView = new Uint8Array(resultBuffer);

  let offset = 0;
  arrayBuffers.forEach((buffer) => {
    let sourceView = new Uint8Array(buffer);
    resultView.set(sourceView, offset);
    offset += buffer.byteLength;
  });

  const draco = new DRACOLoader();
  draco.setDecoderPath('../examples/js/libs/draco/gltf/');

  var loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.parse(resultBuffer, '', function (result) {
    var model = result.scene;
    model.name = modelName;
    model.position.set(position[0], position[1], position[2]);
    model.rotation.set(rotation[0], rotation[1], rotation[2]);
    model.scale.set(scale[0], scale[1], scale[2]);

    scene.add(result.scene);
  });
}
