"use strict";

import * as glm from "gl-matrix";

export class ControlQuad {
  constructor() {
    this.posX = this.posY = this.posZ = 0.0;

    this.idenitityMatrix = new Float32Array(16);
    glm.mat4.identity(this.idenitityMatrix);
  }

  Init(glContext, pipeline, id) {
    this.id = id;

    this.topLeft = { 'x':-0.015, 'y':0.015, 'z':0.0, 'w':1.0, 's':0.0, 't': 0.0, 'q':0.0 };
    this.bottomLeft = { 'x':-0.015, 'y':-0.015, 'z':0.0, 'w':1.0, 's':0.0, 't': 1.0, 'q':0.0 };
    this.bottomRight = { 'x':0.015, 'y':-0.015, 'z':0.0, 'w':1.0, 's':1.0, 't': 1.0, 'q':0.0 };
    this.topRight = { 'x':0.015, 'y':0.015, 'z':0.0, 'w':1.0, 's':1.0, 't': 0.0, 'q':0.0 };

    this.ConstructVertexArray();

    var indices = [
      0, 1, 2,
      3, 0, 2
    ];

    this.vertexBuffer = glContext.createBuffer();
    this.indexBuffer = glContext.createBuffer();

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.STATIC_DRAW);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);

    this.positionAttributeLocation = glContext.getAttribLocation(pipeline, 'vertexPosition');
    this.texCoordAttributeLocation = glContext.getAttribLocation(pipeline, 'texCoord');

    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    this.worldMatrix = new Float32Array(16);
    glm.mat4.identity(this.worldMatrix);
  }

  ConstructVertexArray() {
    this.vertices = [
      this.topLeft.x, this.topLeft.y, this.topLeft.z, this.topLeft.w, this.topLeft.s, this.topLeft.t, this.topLeft.q,
      this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.z, this.bottomLeft.w, this.bottomLeft.s, this.bottomLeft.t, this.bottomLeft.q,
      this.bottomRight.x, this.bottomRight.y, this.bottomRight.z, this.bottomRight.w, this.bottomRight.s, this.bottomRight.t, this.bottomRight.q,
      this.topRight.x, this.topRight.y, this.topRight.z, this.topRight.w, this.topRight.s, this.topRight.t, this.topRight.q
    ];
  }

  BindData(glContext) {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    glContext.vertexAttribPointer(
      this.positionAttributeLocation, // Attribute location
      4, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      7 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      0 // Offset
    );
    glContext.vertexAttribPointer(
      this.texCoordAttributeLocation, // Attribute location
      3, // Number of elements per attribute
      glContext.FLOAT, // Typeof attribute
      glContext.FALSE, // Normalized
      7 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      4 * Float32Array.BYTES_PER_ELEMENT // Offset
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

  UpdateWorldMatrix() {
    var translationVec = glm.vec3.create();
    glm.vec3.set(translationVec, this.posX, this.posY, this.posZ);
    glm.mat4.translate(this.worldMatrix, this.idenitityMatrix, translationVec);
  }

  GetWorldMatrix() {
    return this.worldMatrix;
  }

  GetID() {
    return this.id;
  }
}
