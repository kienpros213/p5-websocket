import { useEffect, useState, useRef } from "react";
import p5 from "p5";
import { switchTool } from "../utils/toolFactory";
import { redrawCanvas } from "../utils/redrawFunction";

const Canvas = (props) => {
  let sketch = null;
  const [tool, setTool] = useState("brushTool");
  let rectangles = useRef([]);
  let brushes = useRef([]);
  let circles = useRef([]);
  let payloadArray = useRef([]);
  let isDraw = false;
  let currentTool;

  function recievePayload() {
    if (props.socket) {
      props.socket.on("serverEmitPayload", (payload) => {
        payloadArray.current.push(payload);
        console.log(payloadArray);
      });
    }
  }

  function sendPayload() {
    if (props.socket) {
      props.socket.emit("sendPayload", {
        startX: 1,
        startY: 2,
        width: 3,
        height: 4,
      });
    }
  }

  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    sketch = new p5((p) => {
      //canvas setup
      p.setup = () => {
        if (props.socket) {
          // props.socket.on("serverEmitPayload", (payload) => {
          //   payloadArray.current.push(payload);
          //   console.log(payloadArray);
          // });

          props.socket.on("serverBrushDraw", (payload) => {
            p.stroke(0);
            p.strokeWeight(5);
            p.line(payload.startX, payload.startY, payload.endX, payload.endY);
          });

          props.socket.on("serverRectDraw", (payload) => {
            p.background("pink");
            redrawCanvas(p, brushes, rectangles, circles);
            p.fill(0, 0, 255, 100);
            p.noStroke();
            p.rect(
              payload.startX,
              payload.startY,
              payload.width,
              payload.height
            );
          });

          props.socket.on("serverPushCircle", (payload) => {
            circles.current.push(payload);
          });
          props.socket.on("serverPushRect", (payload) => {
            rectangles.current.push(payload);
          });
        }
        const canvas = p.createCanvas(700, 700);
        canvas.parent(canvasContainer);
        p.background("pink");
        currentTool = switchTool(
          tool,
          isDraw,
          brushes,
          rectangles,
          circles,
          props.socket
        );
        currentTool.setup(p);
        // mouseDragged
        p.mouseDragged = () => {
          sendPayload();
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
        return () => {
          sketch.remove();
        };
      };

      p.draw = () => {};
    });

    return () => {
      sketch.remove();
    };
  }, [tool]);

  return (
    <div>
      <button
        onClick={() => {
          sendPayload();
        }}
      >
        send payload
      </button>
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
