"use strict";

import * as glm from "gl-matrix";

const cameraCls = require('./camera.js');
const modelCls = require('./model.js');
const textureCls = require('./texture.js');
const shaderCls = require('./shader.js');

export class SceneManager {
  constructor() {
    this.angle = 0;
  }

  Init(glContext, canvas) {
    this.camera = new cameraCls.Camera();
    this.camera.Init(canvas);

    this.shader = new shaderCls.Shader();
    this.shader.Init(glContext);

    this.testModel = new modelCls.Model();
    this.testModel.Init(glContext, this.shader.GetPipeline());

    this.testTexture = new textureCls.Texture();
    this.testTexture.Init(glContext, 'testtexture');

    this.shader.SetActive(glContext);
    this.testModel.SetPositionX(2.0);
  }

  DrawScene(glContext) {
    this.angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    this.testModel.SetRotationY(this.angle);
    glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    this.shader.UpdateParams(glContext, this.camera, this.testModel.GetWorldMatrix());
    this.testTexture.SetActive(glContext);
    this.testModel.Render(glContext);
    this.testTexture.SetInactive(glContext);
  }
}
