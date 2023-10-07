export function redrawCanvas(
  p,
  brushes,
  rectangles,
  circles,
  freeShapes,
  color,
  strokeWeight
) {
  redrawRectangle(p, rectangles, color, strokeWeight);
  redrawCircle(p, circles, color, strokeWeight);
  redrawFreeShape(p, freeShapes, color, strokeWeight);
  redrawBrush(p, brushes, color, strokeWeight);
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

function redrawFreeShape(p, freeShapes) {
  for (const freeShapeArrays of freeShapes.current) {
    p.beginShape();
    for (const shapePoint of freeShapeArrays) {
      console.log(shapePoint);
      p.noFill();
      p.stroke(shapePoint.color);
      p.strokeWeight(shapePoint.strokeWeight);
      p.vertex(shapePoint.startX, shapePoint.startY);
    }
    p.endShape(p.CLOSE);
  }
}
