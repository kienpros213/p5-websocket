import { redrawCanvas } from "./redrawFunction";

export function socketListener(socket, p, brushes, rectangles, circles) {
  if (socket) {
    socket.on("serverBrushDraw", (payload) => {
      brushes.current.push(payload);
      console.log(brushes);
      p.stroke(0);
      p.strokeWeight(5);
      p.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });

    socket.on("serverRectDraw", (payload) => {
      p.background("pink");
      redrawCanvas(p, brushes, rectangles, circles);
      p.noFill();
      p.rect(payload.startX, payload.startY, payload.width, payload.height);
    });

    socket.on("serverCircleDraw", (payload) => {
      p.background("pink");
      redrawCanvas(p, brushes, rectangles, circles);
      p.noFill();
      p.circle(payload.startX, payload.startY, payload.radius);
    });

    socket.on("serverPushCircle", (payload) => {
      console.log(circles);
      circles.current.push(payload);
    });
    socket.on("serverPushRect", (payload) => {
      rectangles.current.push(payload);
    });

    socket.on("serverPushBrush", (payload) => {});
  }
}
