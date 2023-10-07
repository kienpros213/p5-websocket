import { BaseTool } from "./BaseTool";

class FreeShapeTool extends BaseTool {
  constructor(color, strokeWeight, freeShapes, socket) {
    super(color, strokeWeight, socket);
    this.freeShapes = freeShapes;
    this.startX = 0;
    this.startY = 0;
    this.shapeArray = [];
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    this.p.beginShape();
    this.p.stroke(this.color);
    this.p.strokeWeight(this.strokeWeight);
    this.p.noFill();
    for (const shapePoint of this.shapeArray) {
      this.p.vertex(shapePoint.startX, shapePoint.startY);
    }
    this.p.endShape();
  }

  mouseDragged() {}

  mousePressed() {
    const point = {
      startX: this.p.mouseX,
      startY: this.p.mouseY,
      color: this.color,
      strokeWeight: this.strokeWeight,
    };
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
    this.shapeArray.push(point);

    if (this.socket) {
      this.socket.emit("clientFreeShapeDraw", point);
    }
  }

  mouseReleased() {}

  keyPressed() {
    if (this.p.keyCode == this.p.ENTER) {
      this.p.endShape(this.p.CLOSE);
      this.freeShapes.current.push(this.shapeArray);
      this.shapeArray = [];

      if (this.socket) {
        this.socket.emit("clientStopFreeShape", this.shapeArray);
      }
    }
  }
}

export default FreeShapeTool;
