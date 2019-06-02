"use strict";

import * as glm from "gl-matrix";

export class Object3DShader {
  Init(glContext, resourceManager) {
    var vertexShaderText = resourceManager.GetLoadedResource('assets/shaders/object3dVertexShader.glsl');
    var fragmentShaderText = resourceManager.GetLoadedResource('assets/shaders/object3dFragmentShader.glsl');

    vertexShaderText = '#version 300 es\n' +
      'precision mediump float;\n' +
      '\n' +
      'in vec3 vertexPosition;\n' +
      'in vec3 vertexColor;\n' +
      'in vec3 vertexNormal;\n' +
      '\n' +
      'uniform mat4 worldMatrix;\n' +
      'uniform mat4 viewMatrix;\n' +
      'uniform mat4 projMatrix;\n' +
      '\n' +
      'out vec3 fragVertexColor;\n' +
      'out vec3 fragVertexNormal;\n' +
      '\n' +
      'void main()\n' +
      '{\n' +
      '\tfragVertexNormal = (worldMatrix * vec4(vertexNormal, 1.0)).xyz;\n' +
      '    fragVertexColor = vertexColor;\n' +
      '    gl_Position = projMatrix * viewMatrix * worldMatrix * vec4(vertexPosition, 1.0);\n' +
      '}\n';

    fragmentShaderText = '#version 300 es\n' +
      'precision mediump float;\n' +
      '\n' +
      'in vec3 fragVertexColor;\n' +
      'in vec3 fragVertexNormal;\n' +
      '\n' +
      'out vec4 color;\n' +
      '\n' +
      'void main () \n' +
      '{\n' +
      '\tvec3 normal = normalize(fragVertexNormal);\n' +
      '\t\n' +
      '\tfloat lightIntensity = dot(normal, vec3(0.8, 0.7, 1)) * 0.65;\n' +
      '\t\n' +
      '\tcolor = vec4(fragVertexColor.r, fragVertexColor.g, fragVertexColor.b, 1.0);\n' +
      '\tcolor = vec4((color.rgb * lightIntensity) + (color.rgb * vec3(0.2, 0.2, 0.2)), 1.0);\n' +
      '}\n';

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
  }

  SetActive(glContext) {
    glContext.useProgram(this.pipeline);
  }

  UpdateParams(glContext, camera, worldMatrix) {
    var worldMatrixLocation = glContext.getUniformLocation(this.pipeline, 'worldMatrix');
    var viewMatrixLocation = glContext.getUniformLocation(this.pipeline, 'viewMatrix');
    var projMatrixLocation = glContext.getUniformLocation(this.pipeline, 'projMatrix');

    glContext.uniformMatrix4fv(worldMatrixLocation, glContext.FALSE, worldMatrix);
    glContext.uniformMatrix4fv(viewMatrixLocation, glContext.FALSE, camera.GetViewMatrix());
    glContext.uniformMatrix4fv(projMatrixLocation, glContext.FALSE, camera.GetProjMatrixPerspective());
  }

  GetPipeline() {
    return this.pipeline;
  }
}
