class RectangleTool {
  constructor(rectangles, isDraw, socket) {
    this.isDraw = isDraw;
    this.startX = 0;
    this.startY = 0;
    this.width = 0;
    this.height = 0;
    this.rectangles = rectangles;
    this.canClear = true;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    if (this.isDraw) {
      this.p.fill(0, 0, 255, 100);
      this.p.noStroke();
      this.p.rect(
        this.startX,
        this.startY,
        this.p.mouseX - this.startX,
        this.p.mouseY - this.startY
      );
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
    this.rectangles.current.push({
      startX: this.startX,
      startY: this.startY,
      width: this.p.mouseX - this.startX,
      height: this.p.mouseY - this.startY,
    });
  }
}

export default RectangleTool;
