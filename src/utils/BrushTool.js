class BrushTool {
  constructor(brushes, isDraw, socket) {
    this.isDraw = isDraw;
    this.brushes = brushes;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    const brushDrawData = {
      startX: this.p.mouseX,
      startY: this.p.mouseY,
      endX: this.p.pmouseX,
      endY: this.p.pmouseY,
    };

    if (this.isDraw) {
      this.p.stroke(0);
      this.p.strokeWeight(5);
      this.p.line(
        brushDrawData.startX,
        brushDrawData.startY,
        brushDrawData.endX,
        brushDrawData.endY
      );
      this.brushes.current.push(brushDrawData);

      if (this.socket) {
        this.socket.emit("clientBrushDraw", brushDrawData);
      }
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
