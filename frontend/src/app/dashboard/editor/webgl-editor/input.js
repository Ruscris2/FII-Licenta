"use strict";

export class Input {
  constructor() {
    this.posX = 0;
    this.posY = 0;
    this.relX = 0;
    this.relY = 0;
    this.isMouseDown = false;
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

  LBMUpCallback(e) {
    this.isMouseDown = false;
    this.relX = 0;
    this.relY = 0;
  }

  IsMouseDown() {
    return this.isMouseDown;
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
