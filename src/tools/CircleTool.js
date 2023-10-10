import { BaseTool } from './BaseTool';

class CircleTool extends BaseTool {
  constructor(color, strokeWeight, room, circles, socket) {
    super(color, strokeWeight, room, socket);
    this.circles = circles;
    this.startX = 0;
    this.startY = 0;
    this.radius;
  }

  setup(p) {
    this.p = p;
  }

  draw() {}

  mouseDragged() {
    this.radius = Math.sqrt(Math.pow(this.startX - this.p.mouseX, 2) + Math.pow(this.startY - this.p.mouseY, 2));

    const payload = {
      tool: 'circle',
      startX: this.startX,
      startY: this.startY,
      radius: this.radius,
      room: this.room
    };

    this.p.stroke(this.color);
    this.p.strokeWeight(this.strokeWeight);
    this.p.background('pink');
    this.p.noFill();
    this.p.circle(payload.startX, payload.startY, payload.radius);

    if (this.socket) {
      this.socket.emit('clientCircleDraw', payload);
    }
  }

  mousePressed() {
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
  }

  mouseReleased() {
    const payload = {
      tool: 'circle',
      startX: this.startX,
      startY: this.startY,
      radius: this.radius,
      color: this.color,
      strokeWeight: this.strokeWeight,
      room: this.room
    };
    this.width = this.p.mouseX - this.startX;
    this.height = this.p.mouseY - this.startY;
    this.circles.current.push(payload);

    if (this.socket) {
      this.socket.emit('clientPushCircle', payload);
    }
  }
}

export default CircleTool;
