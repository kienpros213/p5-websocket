import React, { useEffect, useRef, useState } from "react";
import p5 from "p5";
import { switchTool } from "./utils/toolFactory";
import { io } from "socket.io-client";
import { redrawCanvas } from "./utils/redrawFunction";
import { drawPayload } from "./utils/drawPayload";

const App = () => {
  let sketch = null;
  const [tool, setTool] = useState("brushTool");
  const socket = useRef();
  // const [socket, setSocket] = useState(null);
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let isDraw = false;
  let currentTool;

  // useEffect(() => {
  //   const initSocket = io("ws://localhost:3000");
  //   setSocket(initSocket);

  //   return () => {
  //     initSocket.disconnect();
  //   };
  // }, []);

  socket.current = io("ws://localhost:3000");

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        const canvas = p.createCanvas(700, 700);
        canvas.parent(canvasContainer);
        p.frameRate(120);
        p.background("pink");
        currentTool = switchTool(
          tool,
          isDraw,
          brushes,
          rectangles,
          circles,
          socket
        );
        currentTool.setup(p);
      };

      p.draw = () => {
        redrawCanvas(p, brushes, rectangles, circles);
        // drawPayload(socket, brushes, rectangles, circles);
        if (socket) {
          socket.current.on("serverBrushDraw", (payload) => {
            p.stroke(0);
            p.strokeWeight(5);
            p.line(payload.startX, payload.startY, payload.endX, payload.endY);
          });

          socket.current.on("serverRectDraw", (payload) => {
            p.background("pink");
            p.fill(0, 0, 255, 100);
            p.noStroke();
            p.rect(
              payload.startX,
              payload.startY,
              payload.width,
              payload.height
            );
          });

          socket.current.on("serverCircleDraw", (payload) => {
            console.log(circles);
            p.background("pink");
            p.fill(0, 0, 255, 100);
            p.noStroke();
            p.circle(payload.startX, payload.startY, payload.radius);
          });

          socket.current.on("serverPushCircle", (payload) => {
            circles.current.push(payload);
          });

          socket.current.on("serverPushRect", (payload) => {
            rectangles.current.push(payload);
          });
        }
      };

      p.mouseDragged = () => {
        currentTool.mouseDragged();
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

export default App;
