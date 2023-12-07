import { useEffect } from 'react';
import { fitToRect } from './fitToRect';

const useSceneControls = (
  event,
  scene,
  shapeName,
  control,
  cameraControls,
  CameraControls,
  xPlane,
  yPlane,
  zPlane,
  socket
) => {
  useEffect(() => {
    const handleMouseUp = () => {
      console.log(scene);
      const currentShape = scene.getObjectByName(shapeName);
      const { x, y, z } = currentShape.position;
      xPlane.position.set(x + 6, y, z);
      yPlane.position.set(x, y, z + 6);
      zPlane.position.set(x, y + 6, z);
    };

    const handleKeyDown = (event) => {
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
        case 88: // X
          fitToRect(xPlane, cameraControls);
          break;
        case 89: // Y
          fitToRect(yPlane, cameraControls);
          break;
        case 90: // Z
          fitToRect(zPlane, cameraControls);
          break;
      }

      if (event.key === 'Enter') {
        // Toggle the value of isDraw
        if (isDraw) {
          points = [];
          const currentShape = scene.getObjectByName(shapeName);
          control.attach(currentShape);
          socket.emit('clientStopDraw');
        }
        if (!isDraw) {
          const currentShape = scene.getObjectByName(shapeName);
          control.detach(currentShape);
        }
        isDraw = !isDraw;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.keyCode) {
        // Alt
        case 18:
          cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
          break;
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [scene, shapeName, control, cameraControls, xPlane, yPlane, zPlane, fitToRect, socket]);
};

export default useSceneControls;
