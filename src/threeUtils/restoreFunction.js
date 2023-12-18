import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

export function restoreFunction(scene, drawData) {
  const freeDrawIndex = drawData.freeDraw.shapeIndex;
  const penDrawIndex = drawData.penDraw.shapeIndex;

  for (let i = 0; i < penDrawIndex; i++) {
    penDrawFunction(scene, drawData.penDraw[i]);
  }

  for (let i = 0; i <= freeDrawIndex; i++) {
    freeDrawFunction(scene, drawData.freeDraw[i]);
    console.log(drawData.freeDraw[i]);
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
  console.log(recievedPoints.flat(2));
  const geometry = new LineGeometry();

  const material = new LineMaterial({
    color: 'red',
    linewidth: 0.005
  });

  const Line = new Line2(geometry, material);
  scene.add(Line);

  geometry.setPositions(recievedPoints.flat(2));
}
