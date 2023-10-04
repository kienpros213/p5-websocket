class RectangleTool {
  constructor(rectangles, isDraw, socket) {
    this.isDraw = isDraw;
    this.startX = 0;
    this.startY = 0;
    this.width = 0;
    this.height = 0;
    this.rectangles = rectangles;
    this.socket = socket;
  }

  setup(p) {
    this.p = p;
  }

  draw() {
    // if (this.isDraw) {
    //   const payload = {
    //     startX: this.startX,
    //     startY: this.startY,
    //     width: this.p.mouseX - this.startX,
    //     height: this.p.mouseY - this.startY,
    //   };
    //   this.p.fill(0, 0, 255, 100);
    //   this.p.noStroke();
    //   this.p.rect(
    //     payload.startX,
    //     payload.startY,
    //     payload.width,
    //     payload.height
    //   );
    //   if (this.socket) {
    //     this.socket.current.emit("clientRectDraw", payload);
    //   }
    // }
  }

  mouseDragged() {
    console.log("rectangle");
    const payload = {
      startX: this.startX,
      startY: this.startY,
      width: this.p.mouseX - this.startX,
      height: this.p.mouseY - this.startY,
    };
    this.p.background("pink");

    this.p.fill(0, 0, 255, 100);
    this.p.noStroke();
    this.p.rect(payload.startX, payload.startY, payload.width, payload.height);
    if (this.socket) {
      this.socket.current.emit("clientRectDraw", payload);
    }
  }
  mousePressed() {
    this.isDraw = true;
    this.startX = this.p.mouseX;
    this.startY = this.p.mouseY;
  }

  mouseReleased() {
    this.isDraw = false;
    const payload = {
      startX: this.startX,
      startY: this.startY,
      width: this.p.mouseX - this.startX,
      height: this.p.mouseY - this.startY,
    };
    this.width = this.p.mouseX - this.startX;
    this.height = this.p.mouseY - this.startY;
    this.rectangles.current.push(payload);
    if (this.socket) {
      this.socket.current.emit("clientPushRect", payload);
    }
  }
}

export default RectangleTool;
