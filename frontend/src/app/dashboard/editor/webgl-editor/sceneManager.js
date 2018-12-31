"use strict";

const cameraCls = require('./camera.js');
const modelCls = require('./model.js');
const textureCls = require('./texture.js');
const shaderCls = require('./shader.js');
const framePickCls = require('./framebufferPicking.js');

export class SceneManager {
  constructor() {
    this.selectedID = -1;
    this.textureLoadList = [];
    this.imageList = [];
    this.toolIndex = 0;
  }

  Init(glContext, canvas, resourceManager) {
    this.camera = new cameraCls.Camera();
    this.camera.Init(canvas);

    this.shader = new shaderCls.Shader();
    this.shader.Init(glContext, resourceManager);

    this.framebufferPick = new framePickCls.FramebufferPicking();
    this.framebufferPick.Init(glContext, canvas);

    this.shader.SetActive(glContext);
  }

  NewTexture(textureName) {
    this.textureLoadList.push(textureName);
  }

  ChangeTool(toolIndex) {
    this.toolIndex = toolIndex;
  }

  SortImagesForAlphaBlending() {
    for(var i = 0; i < this.imageList.length; i++) {
      for(var j = 0; j < this.imageList.length; j++) {
        if(this.imageList[i].model.posZ < this.imageList[j].model.posZ) {
          var aux = this.imageList[j];
          this.imageList[j] = this.imageList[i];
          this.imageList[i] = aux;
        }
      }
    }
  }

  ProcessLogic(glContext, input, canvas) {
    // Handle loading of new images
    if(this.textureLoadList.length > 0) {
      var newImage = {};

      var newModel = new modelCls.Model();
      var image = document.getElementById(this.textureLoadList[0]);
      var width = image.naturalWidth;
      var height = image.naturalHeight;
      newModel.Init(glContext, this.shader.GetPipeline(), this.imageList.length, width, height, canvas);
      newModel.SetPositionZ(-this.imageList.length);

      var newTexture = new textureCls.Texture();
      newTexture.Init(glContext, this.textureLoadList[0]);

      newImage.model = newModel;
      newImage.texture = newTexture;
      this.imageList.push(newImage);

      this.textureLoadList.pop();
      this.SortImagesForAlphaBlending();
    }

    // Handle input based on tool
    if(input.IsMouseDown()) {
      if(this.selectedID === -1) {

        var RGBA = this.framebufferPick.ReadPixel(glContext, input.GetMousePositionX(), canvas.height - input.GetMousePositionY());
        for(var i = 0; i < this.imageList.length; i++) {
          if(this.imageList[i].model.GetID() === RGBA[0]) {
            this.selectedID = i;
            break;
          }
        }
      }
    }
    else {
      this.selectedID = -1;
    }

    if(this.selectedID !== -1) {
      if(this.toolIndex === 0) {
        var posX = this.imageList[this.selectedID].model.posX;
        var posY = this.imageList[this.selectedID].model.posY;
        this.imageList[this.selectedID].model.SetPositionX(posX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[this.selectedID].model.SetPositionY(posY - (input.GetMouseRelativeY() * 0.0042));
      }
      else if(this.toolIndex === 1){
        var rotZ = this.imageList[this.selectedID].model.rotZ;
        this.imageList[this.selectedID].model.SetRotationZ(rotZ + (input.GetMouseRelativeX() * 0.0024));
      }
      else if(this.toolIndex === 2){
        var sclX = this.imageList[this.selectedID].model.sclX;
        var sclY = this.imageList[this.selectedID].model.sclY
        this.imageList[this.selectedID].model.SetScaleX(sclX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[this.selectedID].model.SetScaleY(sclY + (input.GetMouseRelativeY() * 0.0024));
      }
    }
  }

  DrawScene(glContext, input, canvas) {
    this.ProcessLogic(glContext, input, canvas);

    // Draw scene to framebuffer for picking capability
    glContext.clearColor(1.0, 0.0, 0.0, 1.0);
    this.framebufferPick.Clear(glContext);
    this.framebufferPick.SetActive(glContext);

    for(var i = 0; i < this.imageList.length; i++) {
      this.imageList[i].model.BindData(glContext);
      this.shader.SetActive(glContext);
      this.shader.UpdateUBO(glContext, 1.0, this.imageList[i].model.GetID() / 255.0);
      this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
      this.imageList[i].texture.SetActive(glContext); // Not needed, but present for warning suppresion.
      this.imageList[i].model.Render(glContext);
    }

    this.framebufferPick.SetInactive(glContext);

    // Draw textured scene for regular viewer

    this.shader.UpdateUBO(glContext, 0.0, 0.0);

    glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    for(var i = 0; i < this.imageList.length; i++) {
      this.imageList[i].model.BindData(glContext);
      this.shader.SetActive(glContext);
      this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
      this.imageList[i].texture.SetActive(glContext);
      this.imageList[i].model.Render(glContext);
    }
  }
}
