class CircleTool {
  constructor(circles, isDraw) {
    this.isDraw = isDraw;
    this.startX = 0;
    this.startY = 0;
    this.radius;
    this.circles = circles;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    if (this.isDraw) {
      this.radius = Math.sqrt(
        Math.pow(this.startX - this.p.mouseX, 2) +
          Math.pow(this.startY - this.p.mouseY, 2)
      );
      this.p.fill(0, 0, 255, 100);
      this.p.noStroke();
      this.p.circle(this.startX, this.startY, this.radius);
    }
  }

  mousePressed() {
    this.isDraw = true;
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
  }

  mouseReleased() {
    this.isDraw = false;
    this.width = this.p.mouseX - this.startX;
    this.height = this.p.mouseY - this.startY;
    this.circles.current.push({
      startX: this.startX,
      startY: this.startY,
      radius: this.radius,
    });
  }
}

export default CircleTool;
