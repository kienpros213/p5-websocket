import * as THREE from 'three';

export function onPointerMove(event, camera, scene, excludeObjects, points, drawLine, isDraw) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let drawPos = new THREE.Vector3();
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
