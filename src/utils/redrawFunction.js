export function redrawCanvas(p, brushes, rectangles, circles, freeShapes) {
  redrawCircle(p, circles);
  redrawRectangle(p, rectangles);
  redrawBrush(p, brushes);
  redrawFreeShape(p, freeShapes);
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
    p.noFill();
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
    p.noFill();
    p.circle(circle.startX, circle.startY, circle.radius);
  }
}

function redrawFreeShape(p, freeShapes) {
  for (const freeShapeArrays of freeShapes.current) {
    p.beginShape();
    for (const shapePoint of freeShapeArrays) {
      p.vertex(shapePoint.startX, shapePoint.startY);
    }
    p.endShape(p.CLOSE);
  }
}
