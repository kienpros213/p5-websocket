import { redrawCanvas } from './redrawFunction';
import { restoreCanvas } from './restoreCanvas';
let shapeArray = [];

export function socketListener(socket, p, brushes, rectangles, circles, freeShapes, frameBuffer) {
  if (socket) {
    //////////brush//////////
    socket.on('serverBrushDraw', (payload) => {
      brushes.current.push(payload);
      frameBuffer.stroke(payload.color);
      frameBuffer.strokeWeight(payload.strokeWeight);
      frameBuffer.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });
    socket.on('serverPushBrush', (payload) => {});

    //////////rectangle//////////
    socket.on('serverRectDraw', (payload) => {
      frameBuffer.background(51);
      redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer);
      frameBuffer.noFill();
      frameBuffer.rect(payload.startX, payload.startY, payload.width, payload.height);
    });
    socket.on('serverPushRect', (payload) => {
      rectangles.current.push(payload);
    });

    //////////circle//////////
    socket.on('serverCircleDraw', (payload) => {
      frameBuffer.background(51);
      redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer);
      frameBuffer.noFill();
      frameBuffer.circle(payload.startX, payload.startY, payload.radius);
    });
    socket.on('serverPushCircle', (payload) => {
      circles.current.push(payload);
    });

    //////////freeShape//////////
    socket.on('serverFreeShapeDraw', (payload) => {
      shapeArray.push(payload);
      frameBuffer.beginShape();
      frameBuffer.stroke(payload.color);
      frameBuffer.strokeWeight(payload.strokeWeight);
      frameBuffer.noFill();
      for (const shapePoint of shapeArray) {
        frameBuffer.vertex(shapePoint.startX, shapePoint.startY);
      }
      frameBuffer.endShape();
    });

    socket.on('serverStopFreeShape', () => {
      freeShapes.current.push(shapeArray);
      frameBuffer.endShape(p.CLOSE);
      shapeArray = [];
    });

    //////////erase//////////
    socket.on('serverEraseDraw', (payload) => {
      erases.current.push(payload);
      frameBuffer.stroke(51);
      frameBuffer.strokeWeight(payload.strokeWeight);
      frameBuffer.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });
    socket.on('serverErasePush', (payload) => {});

    //////////room//////////
    socket.on('roomJoined', (payload) => {
      brushes.current = [];
      rectangles.current = [];
      circles.current = [];
      freeShapes.current = [];
      frameBuffer.background(51);
      restoreCanvas(
        p,
        payload.brush,
        payload.rectangle,
        payload.circle,
        payload.freeShape,
        brushes,
        rectangles,
        circles,
        freeShapes
      );
    });
  }
}
