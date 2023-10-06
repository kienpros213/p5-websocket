import { useEffect, useState, useRef } from "react";
import p5 from "p5";
import { switchTool } from "../utils/toolFactory";
import { redrawCanvas } from "../utils/redrawFunction";
import { socketListener } from "../utils/SocketListener";
import { ChromePicker } from "react-color";

const Canvas = (props) => {
  const [tool, setTool] = useState("brushTool");
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let freeShapes = useRef([]);
  const [color, setColor] = useState("#fffff");
  let strokeWeight = useRef();
  let currentTool = null;
  let sketch = null;
  // let snapshot;

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        redrawCanvas(p, brushes, rectangles, circles, freeShapes, color);
        socketListener(props.socket, p, brushes, rectangles, circles);
        const canvas = p.createCanvas(700, 700);
        canvas.parent(canvasContainer);
        p.background("pink");
        currentTool = switchTool(
          tool,
          brushes,
          rectangles,
          circles,
          freeShapes,
          color,
          props.socket
        );
        currentTool.setup(p);
        // mouseDragged
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          // p.image(snapshot, 10, 10);
          redrawCanvas(p, brushes, rectangles, circles, freeShapes, color);
        };

        //mouseDown
        p.mousePressed = () => {
          currentTool.mousePressed();
        };

        //mouseUp
        p.mouseReleased = () => {
          currentTool.mouseReleased();
        };

        //key
        p.keyPressed = () => {
          currentTool.keyPressed();
        };

        p.frameRate(60);
      };

      p.draw = () => {
        currentTool.draw();
      };
    });

    return () => {
      sketch.remove();
      console.log("removed");
    };
  }, [tool, color]);

  return (
    <div>
      <ChromePicker
        color={color}
        onChange={(e) => {
          setColor(e.hex);
          console.log(color);
        }}
      />
      <button
        onClick={() => {
          setTool("brushTool");
        }}
      >
        brush
      </button>
      <button
        onClick={() => {
          setTool("rectTool");
        }}
      >
        rectangle tool
      </button>

      <button
        onClick={() => {
          setTool("circleTool");
        }}
      >
        circle tool
      </button>

      <button
        onClick={() => {
          setTool("freeShapeTool");
        }}
      >
        free shape tool
      </button>
      <h1>Rectangle Drawing Tool</h1>
      <div id="canvas-container"></div>
    </div>
  );
};

export default Canvas;
