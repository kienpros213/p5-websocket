import { BaseTool } from "./BaseTool";

class BrushTool extends BaseTool {
  constructor(brushes, color, socket) {
    super();
    this.brushes = brushes;
    this.color = color;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}
  mouseDragged() {
    console.log(this.color);
    const brushDrawData = {
      startX: this.p.mouseX,
      startY: this.p.mouseY,
      endX: this.p.pmouseX,
      endY: this.p.pmouseY,
    };
    this.p.background("pink");
    this.p.stroke(this.color);
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
