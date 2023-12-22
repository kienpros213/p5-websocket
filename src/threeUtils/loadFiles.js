import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const loadFiles = (files, scene, socket) => {
  if (files.length > 0) {
    var filesMap = createFileMap(files);

    var manager = new THREE.LoadingManager();
    manager.setURLModifier(function (url) {
      var file = filesMap[url];

      if (file) {
        console.log('Loading', url);

        return URL.createObjectURL(file);
      }

      return url;
    });

    for (var i = 0; i < files.length; i++) {
      console.log(files[i]);
      loadFile(files[i], scene, socket, manager);
    }
  }
};

function loadFile(file, scene, socket, manager) {
  var filename = file.name;
  var extension = filename.split('.').pop().toLowerCase();

  var reader = new FileReader();
  reader.addEventListener('progress', function () {
    console.log('progress');

    console.log('Loading', filename);
  });

  switch (extension) {
    case 'glb':
      reader.addEventListener(
        'load',
        function (event) {
          const data = event.target.result;
          let offset = 0;
          const chunkSize = 102400; // You can adjust the chunk size as needed
          const fileSize = file.size;
          const fileLength = reader.result.byteLength;
          console.log(reader.result, fileLength);

          function sendChunk() {
            const chunk = new Uint8Array(data.slice(offset, offset + chunkSize));

            if (socket) {
              socket.emit('loadModel', {
                byteLength: fileLength,
                data: chunk,
                fileName: filename
              });
            }

            offset += chunkSize;

            if (offset < fileSize) {
              setTimeout(sendChunk, 0); // Send the next chunk
            }
          }
          sendChunk();

          var contents = event.target.result;

          const draco = new DRACOLoader();
          draco.setDecoderPath('../examples/js/libs/draco/gltf/');
          console.log(draco);

          var loader = new GLTFLoader();
          loader.setDRACOLoader(draco);
          loader.parse(contents, '', function (result) {
            var model = result.scene;
            model.name = filename;

            const pointLight = new THREE.PointLight(0xffffff, 20, 100);

            pointLight.position.set(0, 5, 0);
            const box3 = new THREE.Box3();
            const size = new THREE.Vector3();
            box3.setFromObject(model);
            box3.getSize(size);
            const max = Math.max(size.x, size.y, size.z);
            console.log(max);
            model.scale.setScalar(1 / max);

            scene.add(pointLight);
            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
            scene.add(pointLightHelper);
            console.log(model);
            scene.add(model);
          });
        },
        false
      );
      reader.readAsArrayBuffer(file);
      break;

    case 'gltf':
      console.log(file);
      if (socket) {
        socket.emit('loadModel', file);
      }
      reader.addEventListener(
        'load',
        function (event) {
          console.log(event.target.result);
          var contents = event.target.result;
          var loader;
          loader = new GLTFLoader(manager);
          loader.parse(contents, '', function (result) {
            var model = result.scene;
            model.name = filename;
            scene.add(model);
          });
        },
        false
      );
      reader.readAsArrayBuffer(file);
      break;
  }
}

function createFileMap(files) {
  var map = {};

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    map[file.name] = file;
  }

  return map;
}
