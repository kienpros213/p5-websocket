export function redrawCanvas(p, brushes, rectangles, circles, freeShapes) {
  redrawRectangle(p, rectangles);
  redrawCircle(p, circles);
  redrawFreeShape(p, freeShapes);
  redrawBrush(p, brushes);
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
  console.log("check", freeShapes);
  for (const shape of freeShapes.current) {
    p.beginShape();
    for (const shapePoint of shape.freeShape) {
      p.noFill();
      p.stroke(shapePoint.color);
      p.strokeWeight(shapePoint.strokeWeight);
      p.vertex(shapePoint.startX, shapePoint.startY);
    }
    p.endShape(p.CLOSE);
  }
}
