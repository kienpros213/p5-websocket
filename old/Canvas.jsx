import { useRef } from 'react';
import { Box } from '@chakra-ui/react';

function Canvas() {
  const canvasRef = useRef(null);
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  function setCanvasRef(ref) {
    if (!ref) return;
    canvasRef.current = ref;
  }

  return (
    <>
      <Box>
        <canvas width={windowWidth} height={windowHeight} style={canvasStyle} ref={setCanvasRef} />
      </Box>
    </>
  );
}

export default Canvas;

const canvasStyle = {
  border: '1px solid black'
};
