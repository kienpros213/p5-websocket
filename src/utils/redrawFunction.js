export function redrawCanvas(
  p,
  brushes,
  rectangles,
  circles,
  freeShapes,
  color,
  strokeWeight
) {
  console.log(brushes);
  redrawBrush(p, brushes, color, strokeWeight);
  redrawRectangle(p, rectangles, color, strokeWeight);
  redrawCircle(p, circles, color, strokeWeight);
  redrawFreeShape(p, freeShapes, color, strokeWeight);
}

function redrawBrush(p, brushes) {
  for (const brush of brushes.current) {
    p.stroke(brush.color);
    p.strokeWeight(brush.strokeWeight);
    p.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function redrawRectangle(p, rectangles) {
  for (const rectangle of rectangles.current) {
    console.log(rectangle);
    p.stroke(rectangle.color);
    p.strokeWeight(rectangle.strokeWeight);
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
    p.stroke(circle.color);
    p.strokeWeight(circle.strokeWeight);
    p.noFill();
    p.circle(circle.startX, circle.startY, circle.radius);
  }
}

function redrawFreeShape(p, freeShapes, color, strokeWeight) {
  for (const freeShapeArrays of freeShapes.current) {
    p.stroke(color);
    p.strokeWeight(strokeWeight);
    p.beginShape();
    for (const shapePoint of freeShapeArrays) {
      p.vertex(shapePoint.startX, shapePoint.startY);
    }
    p.endShape(p.CLOSE);
  }
}
