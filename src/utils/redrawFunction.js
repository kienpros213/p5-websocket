export function redrawCanvas(p, brushes, rectangles, circles) {
  redrawCircle(p, circles);
  redrawRectangle(p, rectangles);
  redrawBrush(p, brushes);
}

function redrawBrush(p, brushes) {
  for (const brush of brushes.current) {
    p.stroke(0);
    p.strokeWeight(5);
    p.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function redrawRectangle(p, rectangles) {
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
}

function redrawCircle(p, circles) {
  for (const circle of circles.current) {
    p.fill(0, 0, 255, 100);
    p.noStroke();
    p.circle(circle.startX, circle.startY, circle.radius);
  }
}
