"use strict";
import * as glm from 'gl-matrix/dist/gl-matrix.js';

var vertexShaderText_temp = [
'precision mediump float;',
'',
'attribute vec3 vertexPosition;',
'attribute vec2 texCoord;',
'uniform mat4 worldMatrix;',
'uniform mat4 viewMatrix;',
'uniform mat4 projMatrix;',
'varying vec2 fragTexCoord;',
'void main() {',
'fragTexCoord = texCoord;',
'gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText_temp = [
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'void main () {',
'gl_FragColor = texture2D(sampler, fragTexCoord);',
'}'
].join('\n');

class Renderer {
  constructor() {
    this.glContext = null;
    this.angle = 0;
    this.idenitityMatrix = new Float32Array(16);
    glm.mat4.identity(this.idenitityMatrix);
    this.worldMatrix = new Float32Array(16);
    this.worldMatrixLocation = null;
  }

  Init() {
    console.log('Started initialization of WebGL editor!');

    var canvas = document.getElementById('render-surface');
    this.glContext = canvas.getContext('webgl');

    if(!this.glContext) {
      console.log('Switching to experimental WebGL...');
      this.glContext = canvas.getContext('experimental-webgl');
    }

    if(!this.glContext) {
      alert('Your browser doesn\'t support WebGL rendering');
      return;
    }

    this.glContext.enable(this.glContext.DEPTH_TEST);

    var vertexShader = this.glContext.createShader(this.glContext.VERTEX_SHADER);
    var fragmentShader = this.glContext.createShader(this.glContext.FRAGMENT_SHADER);

    this.glContext.shaderSource(vertexShader, vertexShaderText_temp);
    this.glContext.shaderSource(fragmentShader, fragmentShaderText_temp);

    this.glContext.compileShader(vertexShader);
    if(!this.glContext.getShaderParameter(vertexShader, this.glContext.COMPILE_STATUS)) {
      console.error('Error compiling vertex shader! Debug info:', this.glContext.getShaderInfoLog(vertexShader));
      return;
    }

    this.glContext.compileShader(fragmentShader);
    if(!this.glContext.getShaderParameter(fragmentShader, this.glContext.COMPILE_STATUS)) {
      console.error('Error compiling fragment shader! Debug info:', this.glContext.getShaderInfoLog(fragmentShader));
      return;
    }

    var pipeline = this.glContext.createProgram();
    this.glContext.attachShader(pipeline, vertexShader);
    this.glContext.attachShader(pipeline, fragmentShader);
    this.glContext.linkProgram(pipeline);
    if(!this.glContext.getProgramParameter(pipeline, this.glContext.LINK_STATUS)) {
      console.error('Error linking shaders!');
      return;
    }

    var vertices = [
      -0.5, 0.5, 0.0,      0.0, 0.0,
      -0.5, -0.5, 0.0,     0.0, 1.0,
      0.5, -0.5, 0.0,      1.0, 1.0,
      0.5, 0.5, 0.0,       1.0, 0.0
    ];

    var indices = [
      0, 1, 2,
      3, 0, 2
    ];

    var vertexBuffer = this.glContext.createBuffer();
    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, vertexBuffer);
    this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(vertices), this.glContext.STATIC_DRAW);

    var indexBuffer = this.glContext.createBuffer();
    this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.glContext.STATIC_DRAW);

    var positionAttributeLocation = this.glContext.getAttribLocation(pipeline, 'vertexPosition');
    this.glContext.vertexAttribPointer(
      positionAttributeLocation, // Attribute location
      3, // Number of elements per attribute
      this.glContext.FLOAT, // Typeof attribute
      this.glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      0 // Offset
    );

    var texCoordAttributeLocation = this.glContext.getAttribLocation(pipeline, 'texCoord');
    this.glContext.vertexAttribPointer(
      texCoordAttributeLocation, // Attribute location
      2, // Number of elements per attribute
      this.glContext.FLOAT, // Typeof attribute
      this.glContext.FALSE, // Normalized
      5 * Float32Array.BYTES_PER_ELEMENT, // Sizeof vertex
      3 * Float32Array.BYTES_PER_ELEMENT // Offset
    );

    this.glContext.enableVertexAttribArray(positionAttributeLocation);
    this.glContext.enableVertexAttribArray(texCoordAttributeLocation);

    this.glContext.useProgram(pipeline);

    var testTexture = this.glContext.createTexture();
    this.glContext.bindTexture(this.glContext.TEXTURE_2D, testTexture);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.LINEAR);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.LINEAR);

    this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, this.glContext.RGBA, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE,
      document.getElementById('testtexture'));

    this.worldMatrixLocation = this.glContext.getUniformLocation(pipeline, 'worldMatrix');
    var viewMatrixLocation = this.glContext.getUniformLocation(pipeline, 'viewMatrix');
    var projMatrixLocation = this.glContext.getUniformLocation(pipeline, 'projMatrix');

    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glm.mat4.identity(this.worldMatrix);
    glm.mat4.lookAt(viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
    glm.mat4.perspective(projMatrix, glm.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 100.0);

    this.glContext.uniformMatrix4fv(this.worldMatrixLocation, this.glContext.FALSE, this.worldMatrix);
    this.glContext.uniformMatrix4fv(viewMatrixLocation, this.glContext.FALSE, viewMatrix);
    this.glContext.uniformMatrix4fv(projMatrixLocation, this.glContext.FALSE, projMatrix);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }

  RenderLoop() {
    this.angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glm.mat4.rotate(this.worldMatrix, this.idenitityMatrix, this.angle, [0, 1, 0]);
    this.glContext.uniformMatrix4fv(this.worldMatrixLocation, this.glContext.FALSE, this.worldMatrix);
    this.glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    this.glContext.drawElements(this.glContext.TRIANGLES, 6, this.glContext.UNSIGNED_SHORT, 0);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }
}

export default Renderer;

