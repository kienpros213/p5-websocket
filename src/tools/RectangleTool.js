import { BaseTool } from "./BaseTool";

class RectangleTool extends BaseTool {
  constructor(color, strokeWeight, rectangles, socket) {
    super(color, strokeWeight, socket);
    this.rectangles = rectangles;
    this.startX = 0;
    this.startY = 0;
    this.width = 0;
    this.height = 0;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}

  mouseDragged() {
    console.log(this.strokeWeight);
    const payload = {
      startX: this.startX,
      startY: this.startY,
      width: this.p.mouseX - this.startX,
      height: this.p.mouseY - this.startY,
    };
    this.p.background("pink");
    this.p.noFill();
    this.p.rect(payload.startX, payload.startY, payload.width, payload.height);
    if (this.socket) {
      this.socket.emit("clientRectDraw", payload);
    }
  }
  mousePressed() {
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
  }

  mouseReleased() {
    const payload = {
      startX: this.startX,
      startY: this.startY,
      width: this.p.mouseX - this.startX,
      height: this.p.mouseY - this.startY,
      color: this.color,
      strokeWeight: this.strokeWeight,
    };
    this.width = this.p.mouseX - this.startX;
    this.height = this.p.mouseY - this.startY;
    this.rectangles.current.push(payload);
    if (this.socket) {
      this.socket.emit("clientPushRect", payload);
    }
  }
}

export default RectangleTool;
