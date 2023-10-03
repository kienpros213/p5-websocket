class BrushTool {
  constructor(brushes, isDraw) {
    this.isDraw = isDraw;
    this.startX = 0;
    this.startY = 0;
    this.brushes = brushes;
    this.canClear = false;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    if (this.isDraw) {
      this.p.stroke(0);
      this.p.strokeWeight(5);
      this.p.line(this.p.mouseX, this.p.mouseY, this.p.pmouseX, this.p.pmouseY);
      this.brushes.current.push({
        startX: this.p.mouseX,
        startY: this.p.mouseY,
        endX: this.p.pmouseX,
        endY: this.p.pmouseY,
      });
    }
  }

  mousePressed() {
    this.isDraw = true;
  }

  mouseReleased() {
    this.isDraw = false;
  }
}

export default BrushTool;
