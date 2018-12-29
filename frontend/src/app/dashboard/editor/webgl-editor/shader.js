"use strict";

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

export class Shader {
  Init(glContext) {
    var vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
    var fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);

    glContext.shaderSource(vertexShader, vertexShaderText_temp);
    glContext.shaderSource(fragmentShader, fragmentShaderText_temp);

    glContext.compileShader(vertexShader);
    if(!glContext.getShaderParameter(vertexShader, glContext.COMPILE_STATUS)) {
      console.error('Error compiling vertex shader! Debug info:', glContext.getShaderInfoLog(vertexShader));
      return;
    }

    glContext.compileShader(fragmentShader);
    if(!glContext.getShaderParameter(fragmentShader, glContext.COMPILE_STATUS)) {
      console.error('Error compiling fragment shader! Debug info:', glContext.getShaderInfoLog(fragmentShader));
      return;
    }

    this.pipeline = glContext.createProgram();
    glContext.attachShader(this.pipeline, vertexShader);
    glContext.attachShader(this.pipeline, fragmentShader);
    glContext.linkProgram(this.pipeline);
    if(!glContext.getProgramParameter(this.pipeline, glContext.LINK_STATUS)) {
      console.error('Error linking shaders!');
      return;
    }
  }

  SetActive(glContext) {
    glContext.useProgram(this.pipeline);
  }

  GetPipeline() {
    return this.pipeline;
  }

  UpdateParams(glContext, camera, worldMatrix) {
    var worldMatrixLocation = glContext.getUniformLocation(this.pipeline, 'worldMatrix');
    var viewMatrixLocation = glContext.getUniformLocation(this.pipeline, 'viewMatrix');
    var projMatrixLocation = glContext.getUniformLocation(this.pipeline, 'projMatrix');

    glContext.uniformMatrix4fv(worldMatrixLocation, glContext.FALSE, worldMatrix);
    glContext.uniformMatrix4fv(viewMatrixLocation, glContext.FALSE, camera.GetViewMatrix());
    glContext.uniformMatrix4fv(projMatrixLocation, glContext.FALSE, camera.GetProjMatrix());
  }
}
