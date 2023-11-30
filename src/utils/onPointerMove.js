import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let drawPos = new THREE.Vector3();

export function onPointerMove(event, camera, scene, excludeObjects, isDraw, points) {
  const drawLine = new MeshLineGeometry();
  const drawLineMaterial = new MeshLineMaterial({
    color: '#eb4034',
    lineWidth: 0.1
  });
  const drawLineMesh = new THREE.Mesh(drawLine, drawLineMaterial);
  scene.add(drawLineMesh);

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
