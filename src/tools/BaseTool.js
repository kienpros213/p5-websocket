export class BaseTool {
  constructor(color, strokeWeight, room, socket) {
    this.color = color;
    this.strokeWeight = strokeWeight;
    this.room = room;
    this.socket = socket;
  }

  setup(p) {}

  draw() {}

  mouseMoved() {}

  mouseDragged() {}

  mousePressed() {}

  mouseReleased() {}

  keyPressed() {}
}
