import { BaseTool } from "./BaseTool";

class FreeShapeTool extends BaseTool {
  constructor(socket, freeShapes, color) {
    super();
    this.startX = 0;
    this.startY = 0;
    this.isDraw = false;
    this.shapeArray = [];
    this.freeShapes = freeShapes;
    this.color = color;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    this.p.beginShape();
    for (const shapePoint of this.shapeArray) {
      this.p.vertex(shapePoint.startX, shapePoint.startY);
    }
    // this.p.endShape(this.p.CLOSE);
    this.p.endShape();
  }

  mouseDragged() {}

  mousePressed() {
    console.log(this.freeShapes);
    const point = {
      startX: this.p.mouseX,
      startY: this.p.mouseY,
    };
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
    this.shapeArray.push(point);
  }

  mouseReleased() {}

  keyPressed() {
    if (this.p.keyCode == this.p.ENTER) {
      this.freeShapes.current.push(this.shapeArray);
      this.shapeArray = [];
    }
  }
}

export default FreeShapeTool;
