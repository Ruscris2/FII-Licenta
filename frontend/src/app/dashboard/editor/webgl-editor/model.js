"use strict";

import * as glm from "gl-matrix";

export class Model {
  constructor() {
    this.posX = this.posY = this.posZ = 0.0;
    this.rotX = this.rotY = this.rotZ = 0.0;
    this.sclX = this.sclY = this.sclZ = 1.0;

    this.idenitityMatrix = new Float32Array(16);
    glm.mat4.identity(this.idenitityMatrix);
  }

  Init(glContext, pipeline, id, width, height, canvas) {
    this.id = id;

    var ssWidth, ssHeight;
    if(width <= canvas.width && height <= canvas.height) {
      ssWidth = (canvas.widthOrtho * width) / canvas.width;
      ssHeight = (canvas.heightOrtho * height) / canvas.height;
    }
    else {
      var ratio = width / height;
      if(ratio > 0) {
        ssWidth = canvas.widthOrtho;
        ssHeight = canvas.heightOrtho / ratio;
      }
      else {
        ssWidth = canvas.widthOrtho / ratio;
        ssHeight = canvas.heightOrtho;
      }
    }

    ssWidth = ssWidth / 2;
    ssHeight = ssHeight / 2;

    /*this.vertices = [
      -0.5, 0.5, 0.0,      0.0, 0.0, // TOP LEFT TRIAG 1
      -0.5, -0.5, 0.0,     0.0, 1.0, // BOTTOM LEFT TRIAG 1
      0.5, -0.5, 0.0,      1.0, 1.0, // BOTTOM RIGHT TRIAG 1

      0.5, 0.5, 0.0,       1.0, 0.0, // TOP RIGHT TRIAG 2
      -0.5, 0.5, 0.0,      0.0, 0.0, // TOP LEFT TRIAG 2
      0.5, -0.5, 0.0,      1.0, 1.0  // BOTTOM RIGHT TRIAG 2
    ];*/

    var vertices = [
      -ssWidth, ssHeight, 0.0,      0.0, 0.0, // TOP LEFT TRIAG 1
      -ssWidth, -ssHeight, 0.0,     0.0, 1.0, // BOTTOM LEFT TRIAG 1
      ssWidth, -ssHeight, 0.0,      1.0, 1.0, // BOTTOM RIGHT TRIAG 1

      ssWidth, ssHeight, 0.0,       1.0, 0.0, // TOP RIGHT TRIAG 2
      -ssWidth, ssHeight, 0.0,      0.0, 0.0, // TOP LEFT TRIAG 2
      ssWidth, -ssHeight, 0.0,      1.0, 1.0  // BOTTOM RIGHT TRIAG 2
    ];

     var indices = [
      0, 1, 2,
      3, 4, 5
    ];

    this.vertexBuffer = glContext.createBuffer();
    this.indexBuffer = glContext.createBuffer();

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);

    this.positionAttributeLocation = glContext.getAttribLocation(pipeline, 'vertexPosition');
    this.texCoordAttributeLocation = glContext.getAttribLocation(pipeline, 'texCoord');

    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    this.worldMatrix = new Float32Array(16);
    glm.mat4.identity(this.worldMatrix);
  }

  BindData(glContext) {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    glContext.vertexAttribPointer(
      this.positionAttributeLocation, // Attribute location
      3, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      0 // Offset
    );
    glContext.vertexAttribPointer(
      this.texCoordAttributeLocation, // Attribute location
      2, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset
    );
    glContext.enableVertexAttribArray(this.positionAttributeLocation);
    glContext.enableVertexAttribArray(this.texCoordAttributeLocation);
  }

  Render(glContext) {
    glContext.drawElements(glContext.TRIANGLES, 6, glContext.UNSIGNED_SHORT, 0);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);
  }

  SetPosition(x, y, z) {
    this.posX = x;
    this.posY = y;
    this.posZ = z;
    this.UpdateWorldMatrix();
  }

  SetPositionX(x) { this.SetPosition(x, this.posY, this.posZ); }
  SetPositionY(y) { this.SetPosition(this.posX, y, this.posZ); }
  SetPositionZ(z) { this.SetPosition(this.posX, this.posY, z); }

  SetRotation(x, y, z) {
    this.rotX = x;
    this.rotY = y;
    this.rotZ = z;
    this.UpdateWorldMatrix();
  }

  SetRotationX(x) { this.SetRotation(x, this.rotY, this.rotZ); }
  SetRotationY(y) { this.SetRotation(this.rotX, y, this.rotZ); }
  SetRotationZ(z) { this.SetRotation(this.rotX, this.rotY, z); }

  SetScale(x, y, z) {
    this.sclX = x;
    this.sclY = y;
    this.sclZ = z;
    this.UpdateWorldMatrix();
  }

  SetScaleX(x) { this.SetScale(x, this.sclY, this.sclZ); }
  SetScaleY(y) { this.SetScale(this.sclX, y, this.sclZ); }
  SetScaleZ(z) { this.SetScale(this.sclX, this.sclY, z); }

  UpdateWorldMatrix() {
    var translationVec = glm.vec3.create();
    glm.vec3.set(translationVec, this.posX, this.posY, this.posZ);
    var scaleVec = glm.vec3.create();
    glm.vec3.set(scaleVec, this.sclX, this.sclY, this.sclZ);

    glm.mat4.translate(this.worldMatrix, this.idenitityMatrix, translationVec);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotZ, [0, 0, 1]);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotY, [0, 1, 0]);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotX, [1, 0, 0]);
    glm.mat4.scale(this.worldMatrix, this.worldMatrix, scaleVec);
  }

  GetWorldMatrix() {
    return this.worldMatrix;
  }

  GetID() {
    return this.id;
  }
}
