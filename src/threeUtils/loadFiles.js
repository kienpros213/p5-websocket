import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export const loadFiles = (files, scene) => {
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      loadFile(files[i], scene);
    }
  }
};

function loadFile(file, scene) {
  var filename = file.name;
  var extension = filename.split('.').pop().toLowerCase();

  var reader = new FileReader();
  reader.addEventListener('progress', function (event) {
    console.log('progress');

    console.log('Loading', filename);
  });

  switch (extension) {
    case 'glb':
      reader.addEventListener(
        'load',
        function (event) {
          var contents = event.target.result;

          console.log(DRACOLoader);
          const draco = new DRACOLoader();
          draco.setDecoderPath('../examples/js/libs/draco/gltf/');
          console.log(draco);

          var loader = new GLTFLoader();
          loader.setDRACOLoader(draco);
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
