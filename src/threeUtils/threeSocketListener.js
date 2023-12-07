import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

export function threeSocketListener(scene, payload, recievedPoints) {
  const { id, data } = payload;
  const existObject = recievedPoints.find((obj) => obj.id === id);

  if (existObject) {
    existObject.data.push(data);
  } else {
    const newObject = { id: id, data: data };
    recievedPoints.push(newObject);
  }

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

  console.log(recievedPoints);

  // recievedPoint.push(drawPos);
  drawLine.setPoints(existObject.data.flat());
}
