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

    this.topLeftTriag1 = { 'x':-ssWidth, 'y':ssHeight, 'z':0.0, 'w':1.0, 's':0.0, 't': 0.0, 'q':0.0 };
    this.bottomLeftTriag1 = { 'x':-ssWidth, 'y':-ssHeight, 'z':0.0, 'w':1.0, 's':0.0, 't': 1.0, 'q':0.0 };
    this.bottomRightTriag1 = { 'x':ssWidth, 'y':-ssHeight, 'z':0.0, 'w':1.0, 's':1.0, 't': 1.0, 'q':0.0 };

    this.topRightTriag2 = { 'x':ssWidth, 'y':ssHeight, 'z':0.0, 'w':1.0, 's':1.0, 't': 0.0, 'q':0.0 };
    this.topLeftTriag2 = { 'x':-ssWidth, 'y':ssHeight, 'z':0.0, 'w':1.0, 's':0.0, 't': 0.0, 'q':0.0 };
    this.bottomRightTriag2 = { 'x':ssWidth, 'y':-ssHeight, 'z':0.0, 'w':1.0, 's':1.0, 't': 1.0, 'q':0.0 };

    this.ConstructVertexArray();

     var indices = [
      0, 1, 2,
      3, 4, 5
    ];

    this.vertexBuffer = glContext.createBuffer();
    this.indexBuffer = glContext.createBuffer();

    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(this.vertices), glContext.DYNAMIC_DRAW);

    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);

    this.positionAttributeLocation = glContext.getAttribLocation(pipeline, 'vertexPosition');
    this.texCoordAttributeLocation = glContext.getAttribLocation(pipeline, 'texCoord');

    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    this.worldMatrix = new Float32Array(16);
    glm.mat4.identity(this.worldMatrix);
    this.UpdateWorldVertexPositions();
  }

  LinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4)
  {
    var ua, ub, denominator = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denominator === 0) {
      return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3)) / denominator;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3)) / denominator;
    return {
      x: x1 + ua * (x2 - x1),
      y: y1 + ub * (y2 - y1)
    };
  }

  ConstructVertexArray() {
    // Calculate point of intersection between the two diagonals of the quad
    var p = this.LinesIntersect(this.topLeftTriag1.x, this.topLeftTriag1.y, this.bottomRightTriag1.x, this.bottomRightTriag1.y,
      this.topRightTriag2.x, this.topRightTriag2.y, this.bottomLeftTriag1.x, this.bottomLeftTriag1.y);

    var point = glm.vec3.create();
    glm.vec3.set(point, p.x, p.y, this.topRightTriag2.z);

    var v1 = glm.vec3.create();
    var v2 = glm.vec3.create();
    var v3 = glm.vec3.create();
    var v4 = glm.vec3.create();

    // Calculate the distances from each vertex to the point
    glm.vec3.set(v1, this.topLeftTriag1.x, this.topLeftTriag1.y, this.topLeftTriag1.z);
    glm.vec3.set(v2, this.topRightTriag2.x, this.topRightTriag2.y, this.topRightTriag2.z);
    glm.vec3.set(v3, this.bottomRightTriag1.x, this.bottomRightTriag1.y, this.bottomRightTriag1.z);
    glm.vec3.set(v4, this.bottomLeftTriag1.x, this.bottomLeftTriag1.y, this.bottomLeftTriag1.z);
    var dTopLeft = glm.vec3.distance(point, v1);
    var dTopRight = glm.vec3.distance(point, v2);
    var dBottomLeft = glm.vec3.distance(point, v4);
    var dBottomRight = glm.vec3.distance(point, v3);


    // Calculate the stq coordinates
    // Top left corner
    var dist = (dTopLeft + dBottomRight) / dBottomRight;
    this.topLeftTriag1.s = 0.0;
    this.topLeftTriag1.t = 0.0;
    this.topLeftTriag1.q = dist;
    this.topLeftTriag2.s = 0.0;
    this.topLeftTriag2.t = 0.0;
    this.topLeftTriag2.q = dist;

    // Top right corner
    dist = (dTopRight + dBottomLeft) / dBottomLeft;
    this.topRightTriag2.s = dist;
    this.topRightTriag2.t = 0.0;
    this.topRightTriag2.q = dist;

    // Bottom right corner
    dist = (dBottomRight + dTopLeft) / dTopLeft;
    this.bottomRightTriag1.s = dist;
    this.bottomRightTriag1.t = dist;
    this.bottomRightTriag1.q = dist;
    this.bottomRightTriag2.s = dist;
    this.bottomRightTriag2.t = dist;
    this.bottomRightTriag2.q = dist;

    // Bottom left corner
    dist = (dBottomLeft + dTopRight) / dTopRight;
    this.bottomLeftTriag1.s = 0.0;
    this.bottomLeftTriag1.t = dist;
    this.bottomLeftTriag1.q = dist;

    this.vertices = [
      this.topLeftTriag1.x, this.topLeftTriag1.y, this.topLeftTriag1.z, this.topLeftTriag1.w, this.topLeftTriag1.s, this.topLeftTriag1.t, this.topLeftTriag1.q,
      this.bottomLeftTriag1.x, this.bottomLeftTriag1.y, this.bottomLeftTriag1.z, this.bottomLeftTriag1.w, this.bottomLeftTriag1.s, this.bottomLeftTriag1.t, this.bottomLeftTriag1.q,
      this.bottomRightTriag1.x, this.bottomRightTriag1.y, this.bottomRightTriag1.z, this.bottomRightTriag1.w, this.bottomRightTriag1.s, this.bottomRightTriag1.t, this.bottomRightTriag1.q,
      this.topRightTriag2.x, this.topRightTriag2.y, this.topRightTriag2.z, this.topRightTriag2.w, this.topRightTriag2.s, this.topRightTriag2.t, this.topRightTriag2.q,
      this.topLeftTriag2.x, this.topLeftTriag2.y, this.topLeftTriag2.z, this.topLeftTriag2.w, this.topLeftTriag2.s, this.topLeftTriag2.t, this.topLeftTriag2.q,
      this.bottomRightTriag2.x, this.bottomRightTriag2.y, this.bottomRightTriag2.z, this.bottomRightTriag2.w, this.bottomRightTriag2.s, this.bottomRightTriag2.t, this.bottomRightTriag2.q
    ];
  }

  UpdateVertexBuffer(glContext) {
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
    glContext.bufferSubData(glContext.ARRAY_BUFFER, 0, new Float32Array(this.vertices));
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
  }

  CornerPosition(glContext, x, y, cornerIndex) {
    var inverse = glm.mat4.create();
    var worldPosition = glm.vec4.create();

    glm.vec4.set(worldPosition, x, y, this.posZ, 1.0);
    glm.mat4.invert(inverse, this.worldMatrix);
    glm.vec4.transformMat4(worldPosition, worldPosition, inverse);

    if(cornerIndex === 0) {
      this.topLeftTriag1.x = worldPosition[0];
      this.topLeftTriag1.y = worldPosition[1];
      this.topLeftTriag2.x = worldPosition[0];
      this.topLeftTriag2.y = worldPosition[1];
    }
    else if(cornerIndex === 1) {
      this.topRightTriag2.x = worldPosition[0];
      this.topRightTriag2.y = worldPosition[1];
    }
    else if(cornerIndex === 2) {
      this.bottomLeftTriag1.x = worldPosition[0];
      this.bottomLeftTriag1.y = worldPosition[1];
    }
    else {
      this.bottomRightTriag1.x = worldPosition[0];
      this.bottomRightTriag1.y = worldPosition[1];
      this.bottomRightTriag2.x = worldPosition[0];
      this.bottomRightTriag2.y = worldPosition[1];
    }

    this.ConstructVertexArray();
    this.UpdateVertexBuffer(glContext);
    this.UpdateWorldVertexPositions();
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

    this.UpdateWorldVertexPositions();
  }

  UpdateWorldVertexPositions() {
    var topLeftVertex = glm.vec4.create();
    var topRightVertex = glm.vec4.create();
    var bottomLeftVertex = glm.vec4.create();
    var bottomRightVertex = glm.vec4.create();

    glm.vec4.set(topLeftVertex, this.topLeftTriag1.x, this.topLeftTriag1.y, this.topLeftTriag1.z, this.topLeftTriag1.w);
    glm.vec4.set(topRightVertex, this.topRightTriag2.x, this.topRightTriag2.y, this.topRightTriag2.z, this.topRightTriag2.w);
    glm.vec4.set(bottomLeftVertex, this.bottomLeftTriag1.x, this.bottomLeftTriag1.y, this.bottomLeftTriag1.z, this.bottomLeftTriag1.w);
    glm.vec4.set(bottomRightVertex, this.bottomRightTriag1.x, this.bottomRightTriag1.y, this.bottomRightTriag1.z, this.bottomRightTriag1.w);

    glm.vec4.transformMat4(topLeftVertex, topLeftVertex, this.worldMatrix);
    glm.vec4.transformMat4(topRightVertex, topRightVertex, this.worldMatrix);
    glm.vec4.transformMat4(bottomLeftVertex, bottomLeftVertex, this.worldMatrix);
    glm.vec4.transformMat4(bottomRightVertex, bottomRightVertex, this.worldMatrix);

    this.topLeftVertex = {'x':topLeftVertex[0], 'y':topLeftVertex[1], 'z':topLeftVertex[2]};
    this.topRightVertex = {'x':topRightVertex[0], 'y':topRightVertex[1], 'z':topRightVertex[2]};
    this.bottomLeftVertex = {'x':bottomLeftVertex[0], 'y':bottomLeftVertex[1], 'z':bottomLeftVertex[2]};
    this.bottomRightVertex = {'x':bottomRightVertex[0], 'y':bottomRightVertex[1], 'z':bottomRightVertex[2]};
  }

  GetClipspaceVertex(glContext, camera, canvas, vertexId) {
    var matrix = glm.mat4.create();
    glm.mat4.identity(matrix);
    glm.mat4.multiply(matrix, matrix, camera.GetProjMatrix());
    glm.mat4.multiply(matrix, matrix, camera.GetViewMatrix());
    glm.mat4.multiply(matrix, matrix, this.worldMatrix);

    var clipspace = glm.vec4.create();
    if(vertexId === 0) {
      glm.vec4.set(clipspace, this.topLeftTriag1.x, this.topLeftTriag1.y, this.topLeftTriag1.z, this.topLeftTriag1.w);
    }
    else if(vertexId === 1) {
      glm.vec4.set(clipspace, this.topRightTriag2.x, this.topRightTriag2.y, this.topRightTriag2.z, this.topRightTriag2.w);
    }
    else if(vertexId === 2) {
      glm.vec4.set(clipspace, this.bottomRightTriag1.x, this.bottomRightTriag1.y, this.bottomRightTriag1.z, this.bottomRightTriag1.w);
    }
    else {
      glm.vec4.set(clipspace, this.bottomLeftTriag1.x, this.bottomLeftTriag1.y, this.bottomLeftTriag1.z, this.bottomLeftTriag1.w);
    }

    glm.vec4.transformMat4(clipspace, clipspace, matrix);

    clipspace[0] /= clipspace[3];
    clipspace[1] /= clipspace[3];

    return {
      'x': (clipspace[0] * 0.5 + 0.5) * canvas.width,
      'y': (clipspace[1] * -0.5 + 0.5) * canvas.height
    };
  }

  GetWorldMatrix() {
    return this.worldMatrix;
  }

  GetID() {
    return this.id;
  }
}
