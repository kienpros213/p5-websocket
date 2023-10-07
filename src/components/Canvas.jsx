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
  const [strokeWeight, setStrokeWeight] = useState(3);
  let currentTool = null;
  let sketch = null;
  // let snapshot;

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        console.log(freeShapes);
        socketListener(
          props.socket,
          p,
          brushes,
          rectangles,
          circles,
          freeShapes
        );
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
          strokeWeight,
          props.socket
        );
        currentTool.setup(p);
        redrawCanvas(
          p,
          brushes,
          rectangles,
          circles,
          freeShapes,
          color,
          strokeWeight
        );
        // mouseDragged
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          // p.image(snapshot, 10, 10);
          redrawCanvas(
            p,
            brushes,
            rectangles,
            circles,
            freeShapes,
            color,
            strokeWeight
          );
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
  }, [tool, color, strokeWeight]);

  return (
    <div>
      <ChromePicker
        color={color}
        onChange={(e) => {
          setColor(e.hex);
        }}
      />
      <input
        type="text"
        placeholder="stroke weight"
        // value={strokeWeight}
        onBlur={(e) => {
          setStrokeWeight(e.target.value);
        }}
      ></input>
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
