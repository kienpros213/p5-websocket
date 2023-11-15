export function redrawCanvas(p, brushes, rectangles, circles, freeShapes, frameBuffer) {
  redrawFreeShape(frameBuffer, freeShapes, p);
  redrawCircle(frameBuffer, circles);
  redrawRectangle(frameBuffer, rectangles);
  redrawBrush(frameBuffer, brushes);
}

function redrawBrush(frameBuffer, brushes) {
  for (const brush of brushes.current) {
    frameBuffer.stroke(brush.color);
    frameBuffer.strokeWeight(brush.strokeWeight);
    frameBuffer.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function redrawRectangle(frameBuffer, rectangles) {
  for (const rectangle of rectangles.current) {
    frameBuffer.stroke(rectangle.color);
    frameBuffer.strokeWeight(rectangle.strokeWeight);
    frameBuffer.noFill();
    frameBuffer.rect(rectangle.startX, rectangle.startY, rectangle.width, rectangle.height);
  }
}

function redrawCircle(frameBuffer, circles) {
  for (const circle of circles.current) {
    frameBuffer.stroke(circle.color);
    frameBuffer.strokeWeight(circle.strokeWeight);
    frameBuffer.noFill();
    frameBuffer.circle(circle.startX, circle.startY, circle.radius);
  }
}

function redrawFreeShape(frameBuffer, freeShapes, p) {
  for (const shape of freeShapes.current) {
    frameBuffer.beginShape();
    for (const shapePoint of shape.freeShape) {
      frameBuffer.noFill();
      frameBuffer.stroke(shapePoint.color);
      frameBuffer.strokeWeight(shapePoint.strokeWeight);
      frameBuffer.vertex(shapePoint.startX, shapePoint.startY);
    }
    frameBuffer.endShape(p.CLOSE);
  }
}
