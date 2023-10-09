import { redrawCanvas } from "./redrawFunction";
import { restoreCanvas } from "./restoreCanvas";
let shapeArray = [];

export function socketListener(
  socket,
  p,
  brushes,
  rectangles,
  circles,
  freeShapes
) {
  if (socket) {
    //////////brush//////////
    socket.on("serverBrushDraw", (payload) => {
      brushes.current.push(payload);
      p.stroke(payload.color);
      p.strokeWeight(payload.strokeWeight);
      p.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });
    socket.on("serverPushBrush", (payload) => {});

    //////////rectangle//////////
    socket.on("serverRectDraw", (payload) => {
      p.background("pink");
      redrawCanvas(p, brushes, rectangles, circles, freeShapes);

      p.noFill();
      p.rect(payload.startX, payload.startY, payload.width, payload.height);
    });
    socket.on("serverPushRect", (payload) => {
      rectangles.current.push(payload);
    });

    //////////circle//////////
    socket.on("serverCircleDraw", (payload) => {
      p.background("pink");
      redrawCanvas(p, brushes, rectangles, circles, freeShapes);
      p.noFill();
      p.circle(payload.startX, payload.startY, payload.radius);
    });
    socket.on("serverPushCircle", (payload) => {
      circles.current.push(payload);
    });

    //////////freeShape//////////
    socket.on("serverFreeShapeDraw", (payload) => {
      shapeArray.push(payload);
      p.beginShape();
      p.stroke(payload.color);
      p.strokeWeight(payload.strokeWeight);
      p.noFill();
      for (const shapePoint of shapeArray) {
        p.vertex(shapePoint.startX, shapePoint.startY);
      }
      p.endShape();
    });

    socket.on("serverStopFreeShape", () => {
      freeShapes.current.push(shapeArray);
      p.endShape(p.CLOSE);
      shapeArray = [];
    });

    //////////erase//////////
    socket.on("serverEraseDraw", (payload) => {
      erases.current.push(payload);
      p.stroke("pink");
      p.strokeWeight(payload.strokeWeight);
      p.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });
    socket.on("serverErasePush", (payload) => {});

    //////////room//////////
    socket.on("roomJoined", (payload) => {
      console.log("welcome to room " + payload.room + "");
      restoreCanvas(
        p,
        payload.brush,
        payload.rectangle,
        payload.circle,
        payload.freeShape
      );
    });
  }
}
