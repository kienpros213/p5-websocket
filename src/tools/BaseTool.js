export class BaseTool {
  constructor(color, strokeWeight, room, socket, frameBuffer) {
    this.color = color;
    this.strokeWeight = strokeWeight;
    this.room = room;
    this.socket = socket;
    this.frameBuffer = frameBuffer;
  }

  setup(p) {}

  draw() {}

  mouseMoved() {}

  mouseDragged() {}

  mousePressed() {}

  mouseReleased() {}

  keyPressed() {}
}
