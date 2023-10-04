export function drawPayload(socket, brushes, rectanges, circles) {
  //   drawBrushPayload(socket, brushes);
  //   drawRectPayload(socket, rectanges);
  //   drawCirclePayload(socket, circles);

  if (socket) {
    socket.current.on("serverBrushDraw", (payload) => {
      p.stroke(0);
      p.strokeWeight(5);
      p.line(payload.startX, payload.startY, payload.endX, payload.endY);
    });

    socket.on("serverRectDraw", (payload) => {
      rectanges.current.push(payload);
    });

    socket.on("serverCircleDraw", (payload) => {
      circles.current.push(payload);
    });
  }
}

function drawBrushPayload(socket, brushes) {
  if (socket) {
    socket.on("serverBrushDraw", (payload) => {
      brushes.current.push(payload);
    });
  }
}

function drawRectPayload(socket, rectangles) {
  if (socket) {
    socket.on("serverRectDraw", (payload) => {
      rectangles.current.push(payload);
    });
  }
}

function drawCirclePayload(socket, circles) {
  if (socket) {
    socket.on("serverCircleDraw", (payload) => {
      circles.current.push(payload);
    });
  }
}
