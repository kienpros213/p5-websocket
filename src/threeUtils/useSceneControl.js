import { useEffect } from 'react';
import { fitToRect } from './fitToRect';

export function useSceneControl(
  control,
  cameraControls,
  CameraControls,
  isDraw,
  scene,
  shapeName,
  socket,
  points,
  xPlane,
  yPlane,
  zPlane,
  reverseXPlane
) {
  const handleMouseUp = () => {
    const currentShape = scene.getObjectByName(shapeName);
    const { x, y, z } = currentShape.position;
    xPlane.position.set(x + 6, y, z);
    yPlane.position.set(x, y + 6, z);
    zPlane.position.set(x, y, z + 6);
  };

  const handleKeyDown = (event) => {
    let reverseState = false;

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
      case 88: // X
        if (reverseState) {
          fitToRect(xPlane, cameraControls);
        }
        if (!reverseState) fitToRect(reverseXPlane, cameraControls);
        break;
      case 89: // Y
        fitToRect(yPlane, cameraControls);
        break;
      case 90: // Z
        fitToRect(zPlane, cameraControls);
        break;
      case 18: // Alt
        cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        break;
      case 16: // Shift
        reverseState = true;
        break;
      case 13: // Enter
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
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.keyCode) {
      // Alt
      case 18:
        cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
        break;
      case 16: // Shift
        reverseState = false;
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [control, cameraControls, CameraControls, isDraw, scene, shapeName, socket, points, xPlane, yPlane, zPlane]);
}
