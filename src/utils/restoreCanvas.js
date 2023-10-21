export function restoreCanvas(
  p,
  brushes,
  rectangles,
  circles,
  freeShapes,
  brushesRef,
  rectanglesRef,
  circlesRef,
  freeShapesRef,
  frameBuffer
) {
  if (rectangles != undefined) {
    restoreRectangle(frameBuffer, rectangles, rectanglesRef);
  }
  if (circles != undefined) {
    restoreCircle(frameBuffer, circles, circlesRef);
  }
  if (brushes != undefined) {
    restoreBrush(frameBuffer, brushes, brushesRef);
  }
  if (freeShapes != undefined) {
    restoreFreeShape(frameBuffer, freeShapes, freeShapesRef);
  }
}

function restoreBrush(frameBuffer, brushes, brushesRef) {
  for (const brush of brushes) {
    brushesRef.current.push(brush);
    frameBuffer.stroke(brush.color);
    frameBuffer.strokeWeight(brush.strokeWeight);
    frameBuffer.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function restoreRectangle(frameBuffer, rectangles, rectanglesRef) {
  for (const rectangle of rectangles) {
    rectanglesRef.current.push(rectangle);
    frameBuffer.stroke(rectangle.color);
    frameBuffer.strokeWeight(rectangle.strokeWeight);
    frameBuffer.noFill();
    frameBuffer.rect(rectangle.startX, rectangle.startY, rectangle.width, rectangle.height);
  }
}

function restoreCircle(frameBuffer, circles, circlesRef) {
  for (const circle of circles) {
    circlesRef.current.push(circle);
    frameBuffer.stroke(circle.color);
    frameBuffer.strokeWeight(circle.strokeWeight);
    frameBuffer.noFill();
    frameBuffer.circle(circle.startX, circle.startY, circle.radius);
  }
}

function restoreFreeShape(frameBuffer, freeShapes, freeShapesRef) {
  for (const shape of freeShapes) {
    freeShapesRef.current.push(shape);
    frameBuffer.beginShape();
    for (const shapePoint of shape.freeShape) {
      frameBuffer.noFill();
      frameBuffer.stroke(shapePoint.color);
      frameBuffer.strokeWeight(shapePoint.strokeWeight);
      frameBuffer.vertex(shapePoint.startX, shapePoint.startY);
    }
    frameBuffer.endShape(frameBuffer.CLOSE);
  }
}
