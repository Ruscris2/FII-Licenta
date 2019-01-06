"use strict";

import * as glm from "gl-matrix";

export class Camera {
  Init(glContext, canvas) {
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);

    var min;
    var max;
    if(glContext.drawingBufferWidth > glContext.drawingBufferHeight) {
      min = glContext.drawingBufferHeight;
      max = glContext.drawingBufferWidth;
    }
    else {
      min = glContext.drawingBufferWidth;
      max = glContext.drawingBufferHeight;
    }

    min = min / max;

    glm.mat4.lookAt(this.viewMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);

    if(glContext.drawingBufferWidth > glContext.drawingBufferHeight) {
      glm.mat4.ortho(this.projMatrix, -1.0, 1.0, -min, min, 0.1, 200);
      canvas.widthOrtho = 2.0;
      canvas.heightOrtho = 2 * min;
    }
    else {
      glm.mat4.ortho(this.projMatrix, -min, min, -1.0, 1.0, 0.1, 200);
      canvas.widthOrtho = 2 * min;
      canvas.heightOrtho = 2.0;
    }

    //glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.0);
  }

  GetViewMatrix() {
    return this.viewMatrix;
  }

  GetProjMatrix() {
    return this.projMatrix;
  }
}
