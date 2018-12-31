"use strict";

import * as glm from "gl-matrix";

export class Camera {
  Init(canvas) {
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);

    var min;
    var max;
    if(canvas.width > canvas.height) {
      min = canvas.height;
      max = canvas.width;
    }
    else {
      min = canvas.width;
      max = canvas.height;
    }

    min = min / max;

    glm.mat4.lookAt(this.viewMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);

    if(canvas.width > canvas.height) {
      glm.mat4.ortho(this.projMatrix, -1.0, 1.0, -min, min, 0.1, 100);
      canvas.widthOrtho = 2.0;
      canvas.heightOrtho = 2 * min;
    }
    else {
      glm.mat4.ortho(this.projMatrix, -min, min, -1.0, 1.0, 0.1, 100);
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
