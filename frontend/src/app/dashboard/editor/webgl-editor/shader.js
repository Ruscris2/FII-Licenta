"use strict";

export class Shader {
  Init(glContext, resourceManager) {
    var vertexShaderText = resourceManager.GetLoadedResource('assets/shaders/vertexShader.glsl');
    var fragmentShaderText = resourceManager.GetLoadedResource('assets/shaders/fragmentShader.glsl');

    var vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
    var fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);

    glContext.shaderSource(vertexShader, vertexShaderText);
    glContext.shaderSource(fragmentShader, fragmentShaderText);

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

    // Setup uniform buffer
    var dummyData = new Float32Array(4);
    var uniformLocation = glContext.getUniformBlockIndex(this.pipeline, 'UBO');
    glContext.uniformBlockBinding(this.pipeline, uniformLocation, 0);

    this.uniformBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.UNIFORM_BUFFER, this.uniformBuffer);
    glContext.bufferData(glContext.UNIFORM_BUFFER, dummyData, glContext.DYNAMIC_DRAW);
    glContext.bufferSubData(glContext.UNIFORM_BUFFER, 0, dummyData);
    glContext.bindBuffer(glContext.UNIFORM_BUFFER, null);
  }

  SetActive(glContext) {
    glContext.useProgram(this.pipeline);
    glContext.bindBufferBase(glContext.UNIFORM_BUFFER, 0, this.uniformBuffer);
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

  UpdateUBO(glContext, mode, modeExtra, modeExtra2, modeExtra3) {
    glContext.bindBuffer(glContext.UNIFORM_BUFFER, this.uniformBuffer);
    var data = new Float32Array([mode, modeExtra, modeExtra2, modeExtra3]);
    glContext.bufferSubData(glContext.UNIFORM_BUFFER, 0, data);
    glContext.bindBuffer(glContext.UNIFORM_BUFFER, null);
  }
}
