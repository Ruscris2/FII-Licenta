"use strict";

const cameraCls = require('./camera.js');
const modelCls = require('./model.js');
const textureCls = require('./texture.js');
const shaderCls = require('./shader.js');

export class SceneManager {
  constructor() {
    this.angle = 0;
    this.textureLoadList = [];
  }

  Init(glContext, canvas, resourceManager) {
    this.camera = new cameraCls.Camera();
    this.camera.Init(canvas);

    this.shader = new shaderCls.Shader();
    this.shader.Init(glContext, resourceManager);

    this.testModel = new modelCls.Model();
    this.testModel.Init(glContext, this.shader.GetPipeline());
    this.testModel2 = new modelCls.Model();
    this.testModel2.Init(glContext, this.shader.GetPipeline());

    this.testTexture = new textureCls.Texture();
    this.testTexture.Init(glContext, 'testtexture');
    this.activeTexture = this.testTexture;

    this.shader.SetActive(glContext);
    this.testModel.SetPositionX(2.0);
  }

  NewTexture(textureName) {
    this.textureLoadList.push(textureName);
  }

  DrawScene(glContext) {
    if(this.textureLoadList.length > 0) {
      var newTexture = new textureCls.Texture();
      newTexture.Init(glContext, this.textureLoadList[0]);
      this.activeTexture = newTexture;
      this.textureLoadList.pop();
    }

    this.shader.UpdateUBO(glContext, 0.0, 0.0);

    this.angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    this.testModel.SetRotationY(this.angle);
    this.testModel2.SetRotationX(this.angle);
    glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    this.shader.UpdateParams(glContext, this.camera, this.testModel.GetWorldMatrix());
    this.activeTexture.SetActive(glContext);
    this.testModel.Render(glContext);

    this.shader.UpdateParams(glContext, this.camera, this.testModel2.GetWorldMatrix());
    this.testTexture.SetActive(glContext);
    this.testModel2.Render(glContext);
  }
}
