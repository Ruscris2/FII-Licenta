"use strict";

import * as glm from "gl-matrix";

export class Model {
  constructor() {
    this.vertices = [
      -0.5, 0.5, 0.0,      0.0, 0.0,
      -0.5, -0.5, 0.0,     0.0, 1.0,
      0.5, -0.5, 0.0,      1.0, 1.0,
      0.5, 0.5, 0.0,       1.0, 0.0
    ];

    this.indices = [
      0, 1, 2,
      3, 0, 2
    ];

    this.posX = this.posY = this.posZ = 0.0;
    this.rotX = this.rotY = this.rotZ = 0.0;

    this.idenitityMatrix = new Float32Array(16);
    glm.mat4.identity(this.idenitityMatrix);
  }

  Init(glContext, pipeline, id) {
    this.id = id;

    this.vertexBuffer = glContext.createBuffer();
    this.indexBuffer = glContext.createBuffer();

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), glContext.STATIC_DRAW);

    var positionAttributeLocation = glContext.getAttribLocation(pipeline, 'vertexPosition');
    glContext.vertexAttribPointer(
      positionAttributeLocation, // Attribute location
      3, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      0 // Offset
    );

    var texCoordAttributeLocation = glContext.getAttribLocation(pipeline, 'texCoord');
    glContext.vertexAttribPointer(
      texCoordAttributeLocation, // Attribute location
      2, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset
    );

    glContext.enableVertexAttribArray(positionAttributeLocation);
    glContext.enableVertexAttribArray(texCoordAttributeLocation);

    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    this.worldMatrix = new Float32Array(16);
    glm.mat4.identity(this.worldMatrix);
  }

  Render(glContext) {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

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

  UpdateWorldMatrix() {
    var translationVec = glm.vec3.create();
    glm.vec3.set(translationVec, this.posX, this.posY, this.posZ);

    glm.mat4.translate(this.worldMatrix, this.idenitityMatrix, translationVec);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotZ, [0, 0, 1]);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotY, [0, 1, 0]);
    glm.mat4.rotate(this.worldMatrix, this.worldMatrix, this.rotX, [1, 0, 0]);
  }

  GetWorldMatrix() {
    return this.worldMatrix;
  }

  GetID() {
    return this.id;
  }
}
