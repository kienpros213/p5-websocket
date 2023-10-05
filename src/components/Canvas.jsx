import { useEffect, useState, useRef } from "react";
import p5 from "p5";
import { switchTool } from "../utils/toolFactory";
import { redrawCanvas } from "../utils/redrawFunction";
import { socketListener } from "../utils/SocketListener";

const Canvas = (props) => {
  const [tool, setTool] = useState("brushTool");
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let currentTool = null;
  let sketch = null;

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        redrawCanvas(p, brushes, rectangles, circles);
        socketListener(props.socket, p, brushes, rectangles, circles);
        const canvas = p.createCanvas(700, 700);
        canvas.parent(canvasContainer);
        p.background("pink");
        currentTool = switchTool(
          tool,
          brushes,
          rectangles,
          circles,
          props.socket
        );
        currentTool.setup(p);
        // mouseDragged
        p.mouseDragged = () => {
          currentTool.mouseDragged();
          redrawCanvas(p, brushes, rectangles, circles);
        };

        //mouseDown
        p.mousePressed = () => {
          currentTool.mousePressed();
        };

        //mouseUp
        p.mouseReleased = () => {
          currentTool.mouseReleased();
        };

        p.frameRate(60);
      };

      p.draw = () => {};
    });

    return () => {
      sketch.remove();
      console.log("removed");
    };
  }, [tool]);

  return (
    <div>
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
      <h1>Rectangle Drawing Tool</h1>
      <div id="canvas-container"></div>
    </div>
  );
};

export default Canvas;
