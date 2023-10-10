import { useEffect, useState, useRef } from 'react';
import p5 from 'p5';
import { switchTool } from '../utils/toolFactory';
import { redrawCanvas } from '../utils/redrawFunction';
import { socketListener } from '../utils/SocketListener';
import { ChromePicker } from 'react-color';
import { Box, Button, Input, HStack, VStack } from '@chakra-ui/react';

const Canvas = (props) => {
  const [tool, setTool] = useState('brushTool');
  const [room, setRoom] = useState();
  const [color, setColor] = useState('#fffff');
  const [strokeWeight, setStrokeWeight] = useState(3);
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let freeShapes = useRef([]);
  let currentTool = null;
  let sketch = null;
  // let snapshot;

  useEffect(() => {
    const canvasContainer = document.getElementById('canvas-container');
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        socketListener(props.socket, p, brushes, rectangles, circles, freeShapes);
        const canvas = p.createCanvas(700, 700);
        canvas.parent(canvasContainer);
        p.background('pink');
        currentTool = switchTool(
          tool,
          brushes,
          rectangles,
          circles,
          freeShapes,
          color,
          room,
          strokeWeight,
          props.socket
        );
        currentTool.setup(p);
        redrawCanvas(p, brushes, rectangles, circles, freeShapes, color, strokeWeight);
        // mouseDragged
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          redrawCanvas(p, brushes, rectangles, circles, freeShapes, color, strokeWeight);
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
  }, [tool, color, strokeWeight, room]);

  const clearCanvas = () => {
    sketch.background('pink');
  };

  return (
    <HStack>
      <VStack>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <Input
          backgroundColor="white"
          width="200px"
          type="text"
          placeholder="room"
          onBlur={(e) => setRoom(e.target.value)}
        ></Input>
        <Button
          onClick={() => {
            if (props.socket) {
              props.socket.emit('joinRequest', room);
            }
          }}
        >
          join
        </Button>
        <Input
          backgroundColor="white"
          width="200px"
          type="text"
          placeholder="stroke weight"
          onBlur={(e) => {
            setStrokeWeight(e.target.value);
          }}
        ></Input>
        <Box>
          <Button onClick={() => clearCanvas()}>clear</Button>
          <Button onClick={() => setTool('brushTool')}>brush</Button>
          <Button onClick={() => setTool('rectTool')}>rectangle tool</Button>
          <Button onClick={() => setTool('circleTool')}>circle tool</Button>
          <Button onClick={() => setTool('freeShapeTool')}>free shape tool</Button>
        </Box>
      </VStack>
      <Box id="canvas-container"></Box>
    </HStack>
  );
};

export default Canvas;
