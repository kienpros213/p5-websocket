export function redrawCanvas(
  p,
  brushes,
  rectangles,
  circles,
  freeShapes,
  color
) {
  redrawCircle(p, circles, color);
  redrawRectangle(p, rectangles, color);
  redrawBrush(p, brushes, color);
  redrawFreeShape(p, freeShapes, color);
}

function redrawBrush(p, brushes, color) {
  for (const brush of brushes.current) {
    p.stroke(color);
    p.strokeWeight(5);
    p.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function redrawRectangle(p, rectangles, color) {
  for (const rectangle of rectangles.current) {
    p.stroke(color);
    p.noFill();
    p.rect(
      rectangle.startX,
      rectangle.startY,
      rectangle.width,
      rectangle.height
    );
  }
}

function redrawCircle(p, circles, color) {
  for (const circle of circles.current) {
    p.stroke(color);
    p.noFill();
    p.circle(circle.startX, circle.startY, circle.radius);
  }
}

function redrawFreeShape(p, freeShapes, color) {
  for (const freeShapeArrays of freeShapes.current) {
    p.stroke(color);
    p.beginShape();
    for (const shapePoint of freeShapeArrays) {
      p.vertex(shapePoint.startX, shapePoint.startY);
    }
    p.endShape(p.CLOSE);
  }
}
