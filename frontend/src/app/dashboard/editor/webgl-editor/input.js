"use strict";

export class Input {
  constructor() {
    this.posX = 0;
    this.posY = 0;
    this.relX = 0;
    this.relY = 0;
    this.isMouseDown = false;
    this.mouseClicked = false;
    this.keyState = [];
    for(var i = 0; i < 256; i ++){
      this.keyState.push(false);
    }
  }

  Init(canvas) {
    var inputContext = this;

    var boundingBox = canvas.getBoundingClientRect();
    this.offsetX = boundingBox.left;
    this.offsetY = boundingBox.top;

    canvas.addEventListener('mousedown', function (e) {
      inputContext.LBMDownCallback(e);
    });

    canvas.addEventListener('mouseup', function (e) {
      inputContext.LBMUpCallback(e);
    });
    canvas.addEventListener('mousemove', function(e) {
      inputContext.MouseMove(e);
    });
    document.onkeypress = function(e) {
      inputContext.KeyDownCallback(e);
    };
    document.onkeyup = function(e) {
      inputContext.KeyUpCallback(e);
    };
  }

  LBMDownCallback(e) {
    this.posX = e.clientX - this.offsetX;
    this.posY = e.clientY - this.offsetY;

    this.isMouseDown = true;
  }

  MouseMove(e) {
    this.relX = (e.clientX - this.offsetX) - this.posX;
    this.relY = (e.clientY - this.offsetY) - this.posY;

    this.posX = e.clientX - this.offsetX;
    this.posY = e.clientY - this.offsetY;
  }

  KeyDownCallback(e) {
    this.keyState[e.keyCode] = true;
  }

  KeyUpCallback(e) {
    for(var i = 0; i < this.keyState.length; i++) {
      this.keyState[i] = false;
    }
  }

  IsKeyDown(key) {
    return this.keyState[key.charCodeAt(0)];
  }

  LBMUpCallback(e) {
    this.isMouseDown = false;
    this.relX = 0;
    this.relY = 0;
    this.mouseClicked = true;
  }

  IsMouseDown() {
    return this.isMouseDown;
  }

  WasMouseClicked() {
    if(this.mouseClicked){
      this.mouseClicked = false;
      return true;
    }
    return false;
  }

  GetMousePositionX() {
    return this.posX;
  }

  GetMousePositionY() {
    return this.posY;
  }

  GetMouseRelativeX() {
    if(isNaN(this.relX))
      return 0;
    return this.relX;
  }

  GetMouseRelativeY() {
    if(isNaN(this.relY))
      return 0;
    return this.relY;
  }
}
