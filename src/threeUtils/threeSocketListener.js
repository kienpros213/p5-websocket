import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

let drawPos = new THREE.Vector3();

export function threeSocketListener(scene, payload, recievedPoint) {
  console.log(payload);
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
  drawPos = payload;

  recievedPoint.push(drawPos);
  drawLine.setPoints(recievedPoint.flat());
}
