import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { concatArrayBuffer } from './concatArrayBuffer';
import * as THREE from 'three';

let receivedChunks = [];

export function loadModel(payload, scene) {
  console.log(payload.byteLength);
  receivedChunks.push(payload.data);
  const combinedBuffer = concatArrayBuffer(...receivedChunks);
  console.log(combinedBuffer);
  if (combinedBuffer.byteLength === payload.byteLength) {
    const draco = new DRACOLoader();
    draco.setDecoderPath('../examples/js/libs/draco/gltf/');

    var loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.parse(combinedBuffer, '', function (result) {
      var model = result.scene;
      model.name = payload.fileName;
      const box3 = new THREE.Box3();
      const size = new THREE.Vector3();

      box3.setFromObject(model);
      box3.getSize(size);
      1;
      const min = Math.min(size.x, size.y, size.z);
      model.scale.setScalar(1 / min);

      scene.add(result.scene);

      receivedChunks = [];
    });
  }
}
