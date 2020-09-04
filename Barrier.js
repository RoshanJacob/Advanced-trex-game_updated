class Barrier {
  constructor(x, y, w, h) {
    this.barrier = createSprite(x, y, w, h);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  display() {
    drawSprites();
  }
}
