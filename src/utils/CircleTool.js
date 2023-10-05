class CircleTool {
  constructor(circles, socket) {
    this.startX = 0;
    this.startY = 0;
    this.radius;
    this.circles = circles;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}

  mouseDragged() {
    this.radius = Math.sqrt(
      Math.pow(this.startX - this.p.mouseX, 2) +
        Math.pow(this.startY - this.p.mouseY, 2)
    );

    const payload = {
      startX: this.startX,
      startY: this.startY,
      radius: this.radius,
    };

    this.p.background("pink");
    this.p.fill(0, 0, 255, 100);
    this.p.noStroke();
    this.p.circle(payload.startX, payload.startY, payload.radius);

    if (this.socket) {
      this.socket.emit("clientCircleDraw", payload);
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
      radius: this.radius,
    };
    this.width = this.p.mouseX - this.startX;
    this.height = this.p.mouseY - this.startY;
    this.circles.current.push(payload);

    if (this.socket) {
      this.socket.emit("clientPushCircle", payload);
    }
  }
}

export default CircleTool;
