import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import { switchTool } from '../utils/toolFactory';
import { redrawCanvas } from '../utils/redrawFunction';
import { socketListener } from '../utils/SocketListener';
import { Box, HStack } from '@chakra-ui/react';

const Canvas = (props) => {
  const [strokeWeight, setStrokeWeight] = useState(3);
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let freeShapes = useRef([]);
  let currentTool = null;
  let sketch = null;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  // let snapshot;

  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        socketListener(props.socket, p, brushes, rectangles, circles, freeShapes);
        const canvas = p.createCanvas(windowWidth, windowHeight);
        canvas.parent(canvasContainer);
        p.background('pink');
        currentTool = switchTool(
          props.tool,
          brushes,
          rectangles,
          circles,
          freeShapes,
          props.color,
          props.room,
          strokeWeight,
          props.socket
        );
        currentTool.setup(p);
        redrawCanvas(p, brushes, rectangles, circles, freeShapes, props.color, strokeWeight);
        // mouseDragged
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          redrawCanvas(p, brushes, rectangles, circles, freeShapes, props.color, strokeWeight);
        };
        p.mouseMoved = () => {
          currentTool.mouseMoved();
          redrawCanvas(p, brushes, rectangles, circles, freeShapes, props.color, strokeWeight);
        };
        //mouseDown
        p.mousePressed = () => currentTool.mousePressed();
        //mouseUp
        p.mouseReleased = () => currentTool.mouseReleased();
        //key
        p.keyPressed = () => currentTool.keyPressed();
        p.frameRate(60);
      };

      p.draw = () => currentTool.draw();
    });

    return () => {
      sketch.remove();
      console.log('removed');
    };
  }, [props.tool, props.color, strokeWeight, props.room]);

  const clearCanvas = () => {
    sketch.background('pink');
  };

  return (
    <HStack backgroundColor="red">
      <Box id="canvas-container"></Box>
    </HStack>
  );
};

export default Canvas;
