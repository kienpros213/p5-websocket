import { BaseTool } from "./BaseTool";

class BrushTool extends BaseTool {
  constructor(brushes, socket) {
    super();
    this.brushes = brushes;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}
  mouseDragged() {
    console.log(this.brushes);
    const brushDrawData = {
      startX: this.p.mouseX,
      startY: this.p.mouseY,
      endX: this.p.pmouseX,
      endY: this.p.pmouseY,
    };
    this.p.background("pink");
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

  mousePressed() {}

  mouseReleased() {}
}

export default BrushTool;
