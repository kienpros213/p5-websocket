export class BaseTool {
  constructor(color, strokeWeight, socket) {
    this.color = color;
    this.strokeWeight = strokeWeight;
    this.socket = socket;
  }

  setup(p) {}

  draw() {}

  mouseDragged() {}

  mousePressed() {}

  mouseReleased() {}

  keyPressed() {}
}
