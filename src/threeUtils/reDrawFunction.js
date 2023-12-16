import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

export function reDrawFunction(scene, recievedPoints) {
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
