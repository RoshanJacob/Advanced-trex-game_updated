class Start {
  constructor() {
    this.input = createInput('Type your name here');
    this.button = createButton('PLAY');
    this.info = createElement('h2');
  }
  display() {
    this.info.html('Testing Prototype');
    this.info.position();
    this.button.position(displayWidth / 2 + 30, displayHeight / 2);
  }
}
