import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import { switchTool } from '../utils/toolFactory';
import { redrawCanvas } from '../utils/redrawFunction';
import { socketListener } from '../utils/SocketListener';
import { Box, HStack } from '@chakra-ui/react';

const TestCanvas = (props) => {
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let freeShapes = useRef([]);
  let currentTool = null;
  let sketch = null;
  let frameBuffer;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  // let snapshot;

  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        //init frameBuffer
        frameBuffer = p.createGraphics(windowWidth, windowHeight);
        frameBuffer.background(51);
        //init socket listener
        socketListener(props.socket, p, brushes, rectangles, circles, freeShapes, frameBuffer);
        //init canvas
        const canvas = p.createCanvas(windowWidth, windowHeight);
        canvas.parent(canvasContainer);
        p.background(51);
        redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer);
        //init factory
        currentTool = switchTool(
          props.tool,
          brushes,
          rectangles,
          circles,
          freeShapes,
          props.color,
          props.room,
          props.strokeWeight,
          props.socket,
          frameBuffer
        );
        currentTool.setup(p);

        //event listener
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer);
        };
        p.mouseMoved = () => {
          currentTool.mouseMoved();
          if (props.tool == 'freeShapeTool') {
            redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer);
          }
        };
        //mouseDown
        p.mousePressed = () => currentTool.mousePressed();
        //mouseUp
        p.mouseReleased = () => currentTool.mouseReleased();
        //key
        p.keyPressed = () => currentTool.keyPressed();
        p.frameRate(60);
      };

      p.draw = () => {
        currentTool.draw();
        p.image(frameBuffer, 0, 0);
      };
    });

    return () => {
      sketch.remove();
      console.log('removed');
    };
  }, [props.tool, props.color, props.strokeWeight, props.room]);

  return (
    <HStack backgroundColor="red">
      <Box id="canvas-container"></Box>
    </HStack>
  );
};

export default TestCanvas;
