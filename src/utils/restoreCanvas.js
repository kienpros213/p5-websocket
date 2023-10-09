export function restoreCanvas(
  p,
  brushes,
  rectangles,
  circles,
  freeShapes,
  brushesRef,
  rectanglesRef,
  circlesRef,
  freeShapesRef
) {
  restoreRectangle(p, rectangles, rectanglesRef);
  restoreCircle(p, circles, circlesRef);
  restoreFreeShape(p, freeShapes, freeShapesRef);
  restoreBrush(p, brushes, brushesRef);
}

function restoreBrush(p, brushes, brushesRef) {
  for (const brush of brushes) {
    brushesRef.current.push(brush);
    p.stroke(brush.color);
    p.strokeWeight(brush.strokeWeight);
    p.line(brush.startX, brush.startY, brush.endX, brush.endY);
  }
}

function restoreRectangle(p, rectangles, rectanglesRef) {
  for (const rectangle of rectangles) {
    rectanglesRef.current.push(rectangle);
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

function restoreCircle(p, circles, circlesRef) {
  for (const circle of circles) {
    circlesRef.current.push(circle);
    p.stroke(circle.color);
    p.strokeWeight(circle.strokeWeight);
    p.noFill();
    p.circle(circle.startX, circle.startY, circle.radius);
  }
}

function restoreFreeShape(p, freeShapes, freeShapesRef) {
  for (const shape of freeShapes) {
    freeShapesRef.current.push(shape);
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
