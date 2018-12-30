"use strict";

import * as glm from "gl-matrix";

export class Camera {
  Init(canvas) {
    this.viewMatrix = new Float32Array(16);
    this.projMatrix = new Float32Array(16);
    glm.mat4.lookAt(this.viewMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    glm.mat4.ortho(this.projMatrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);
    //glm.mat4.perspective(this.projMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.0);
  }

  GetViewMatrix() {
    return this.viewMatrix;
  }

  GetProjMatrix() {
    return this.projMatrix;
  }
}
