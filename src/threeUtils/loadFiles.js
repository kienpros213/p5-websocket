import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const loadFiles = (files, scene, socket, room) => {
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
      loadFile(files[i], scene, socket, manager, room);
    }
  }
};

function loadFile(file, scene, socket, manager, room) {
  var filename = file.name;
  var extension = filename.split('.').pop().toLowerCase();

  var reader = new FileReader();

  switch (extension) {
    case 'glb':
      reader.addEventListener(
        'load',
        function (event) {
          const data = event.target.result;
          let offset = 0;
          const chunkSize = 102400;
          const fileSize = file.size;
          const fileLength = reader.result.byteLength;

          function sendChunk() {
            const chunk = new Uint8Array(data.slice(offset, offset + chunkSize));
            console.log(room);
            if (socket) {
              socket.emit('loadModel', {
                byteLength: fileLength,
                data: chunk,
                fileName: filename,
                room: room
              });
            }
            offset += chunkSize;
            if (offset < fileSize) {
              setTimeout(sendChunk, 0);
            }
          }
          sendChunk();

          var contents = event.target.result;

          const draco = new DRACOLoader();
          draco.setDecoderPath('../examples/js/libs/draco/gltf/');

          var loader = new GLTFLoader();
          loader.setDRACOLoader(draco);
          loader.parse(contents, '', function (result) {
            var model = result.scene;
            model.name = filename;

            // const pointLight = new THREE.PointLight(0xffffff, 20, 100);

            // pointLight.position.set(0, 5, 0);
            const box3 = new THREE.Box3();
            const size = new THREE.Vector3();
            box3.setFromObject(model);
            box3.getSize(size);
            const min = Math.min(size.x, size.y, size.z);
            model.scale.setScalar(1 / min);

            // scene.add(pointLight);
            // const sphereSize = 1;
            // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize, '#f54248');
            // scene.add(pointLightHelper);
            scene.add(model);
          });
        },
        false
      );
      reader.readAsArrayBuffer(file);
      break;

    // case 'gltf':
    //   if (socket) {
    //     socket.emit('loadModel', file);
    //   }
    //   reader.addEventListener(
    //     'load',
    //     function (event) {
    //       var contents = event.target.result;
    //       var loader;
    //       loader = new GLTFLoader(manager);
    //       loader.parse(contents, '', function (result) {
    //         var model = result.scene;
    //         model.name = filename;
    //         scene.add(model);
    //       });
    //     },
    //     false
    //   );
    //   reader.readAsArrayBuffer(file);
    //   break;

    default:
      console.log('unsupported format');
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
