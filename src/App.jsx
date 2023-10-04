import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { switchTool } from "./utils/toolFactory";

const App = () => {
  let sketch = null;
  const [tool, setTool] = useState("rectTool");
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let isDraw = false;
  let currentTool;

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");

    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.parent(canvasContainer);
        currentTool = switchTool(tool, isDraw, brushes, rectangles, circles);
        currentTool.setup(p);
      };

      //draw loop
      p.draw = () => {
        console.log("circles", circles);
        p.background("pink");
        currentTool.draw();
        for (const brush of brushes.current) {
          p.stroke(0);
          p.strokeWeight(5);
          p.line(brush.startX, brush.startY, brush.endX, brush.endY);
        }

        for (const rectangle of rectangles.current) {
          p.fill(0, 0, 255, 100);
          p.noStroke();
          p.rect(
            rectangle.startX,
            rectangle.startY,
            rectangle.width,
            rectangle.height
          );
        }

        for (const circle of circles.current) {
          p.fill(0, 0, 255, 100);
          p.noStroke();
          p.circle(circle.startX, circle.startY, circle.radius);
        }
      };

      //mousedown
      p.mousePressed = () => {
        currentTool.mousePressed();
      };

      //mosueup
      p.mouseReleased = () => {
        currentTool.mouseReleased();
      };
    });

    console.log("currentTool", currentTool);

    return () => {
      sketch.remove();
    };
  }, [tool]);

  return (
    <div>
      <button
        onClick={() => {
          setTool("brushTool");
          console.log(tool);
        }}
      >
        brush
      </button>
      <button
        onClick={() => {
          setTool("rectTool");
          console.log(tool);
        }}
      >
        rectangle tool
      </button>

      <button
        onClick={() => {
          setTool("circleTool");
          console.log(tool);
        }}
      >
        circle tool
      </button>
      <h1>Rectangle Drawing Tool</h1>
      <div id="canvas-container"></div>
    </div>
  );
};

export default App;
