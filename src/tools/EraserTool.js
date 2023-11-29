import { BaseTool } from './BaseTool';

class EraserTool extends BaseTool {
  constructor(color, strokeWeight, room, brushes, socket, frameBuffer) {
    super(color, strokeWeight, room, socket, frameBuffer);
    this.brushes = brushes;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}
  mouseDragged() {
    const brushDrawData = {
      tool: 'brush',
      startX: this.p.mouseX,
      startY: this.p.mouseY,
      endX: this.p.pmouseX,
      endY: this.p.pmouseY,
      color: 51,
      strokeWeight: this.strokeWeight,
      room: this.room
    };
    this.frameBuffer.background(51);
    this.frameBuffer.stroke(51);
    this.frameBuffer.strokeWeight(this.strokeWeight);
    this.frameBuffer.line(brushDrawData.startX, brushDrawData.startY, brushDrawData.endX, brushDrawData.endY);

    this.brushes.current.push(brushDrawData);

    if (this.socket) {
      this.socket.emit('clientBrushDraw', brushDrawData);
    }
  }

  mousePressed() {}

  mouseReleased() {}
}

export default EraserTool;
