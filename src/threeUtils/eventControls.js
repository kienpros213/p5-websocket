import _ from 'lodash';
const handleMouseUp = (scene, shapeName, xPlane, yPlane, zPlane) => {
  const currentShape = scene.getObjectByName(shapeName);
  const { x, y, z } = currentShape.position;
  xPlane.position.set(x + 6, y, z);
  yPlane.position.set(x, y + 6, z);
  zPlane.position.set(x, y, z + 6);
};

const handleKeyDown = (event, control, cameraControls, CameraControls, isDraw, scene, shapeName, socket, points) => {
  switch (event.keyCode) {
    case 87: // W
      control.setMode('translate');
      break;
    case 69: // E
      control.setMode('rotate');
      break;
    case 82: // R
      control.setMode('scale');
      break;
    case 18: // Alt
      cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
      break;
    case 13: //Enter
      isDraw = !isDraw;
      const currentShape = scene.getObjectByName(shapeName);
      if (isDraw) {
        points = [];
        control.detach(currentShape);

        socket.emit('clientStartDraw');
      }
      if (!isDraw) {
        control.attach(currentShape);
        socket.emit('clientStopDraw');
      }
  }
  return { isDraw, points };
};

const handleKeyUp = (event, cameraControls, CameraControls) => {
  switch (event.keyCode) {
    //Alt
    case 18:
      cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
      break;
  }
};

export { handleMouseUp, handleKeyDown, handleKeyUp };
