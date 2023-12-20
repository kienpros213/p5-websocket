import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let drawPos = new THREE.Vector3();

export function onPointerMove(event, camera, scene, excludeObjects, isDraw, points, socket, lineMesh, room) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children.filter((obj) => !excludeObjects.includes(obj)));
  if (intersects.length > 0 && isDraw) {
    drawPos = [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z];
    if (socket) {
      socket.emit('freeDraw', { drawPos: drawPos, room: room });
    }
    points.push(drawPos);
    lineMesh.setPoints(points.flat());
  }
}
