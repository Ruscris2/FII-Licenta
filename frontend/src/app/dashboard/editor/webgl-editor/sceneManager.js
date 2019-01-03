"use strict";

const cameraCls = require('./camera.js');
const modelCls = require('./model.js');
const textureCls = require('./texture.js');
const shaderCls = require('./shader.js');
const framePickCls = require('./framebufferPicking.js');
const controlQuadCls = require('./controlQuad.js');

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

    // Load a dummy texture (used for warning suppresion in shader due to unbinded texture)
    this.dummyTexture = new textureCls.Texture();
    this.dummyTexture.Init(glContext, 'logonav');

    // Init four Control Quads for distort transformation
    for(var i = 0; i < 4; i++) {
      var controlQuad = {};

      var controlQuadMdl = new controlQuadCls.ControlQuad();
      controlQuadMdl.Init(glContext, this.shader.GetPipeline(), i);
      controlQuadMdl.SetPositionZ(1.0);

      controlQuad.model = controlQuadMdl;
      controlQuad.texture = this.dummyTexture;

      this.imageList.push(controlQuad);
    }
  }

  NewTexture(textureName) {
    this.textureLoadList.push(textureName);
  }

  ChangeTool(toolIndex) {
    this.toolIndex = toolIndex;

    // First time the distort tool gets selected, set the control quads to each corner of the selected layer
    // TODO: Actually implement layers
    if(this.toolIndex === 3) {
      this.imageList[0].model.SetPositionX(this.imageList[4].model.topLeftVertex.x);
      this.imageList[0].model.SetPositionY(this.imageList[4].model.topLeftVertex.y);

      this.imageList[1].model.SetPositionX(this.imageList[4].model.topRightVertex.x);
      this.imageList[1].model.SetPositionY(this.imageList[4].model.topRightVertex.y);

      this.imageList[2].model.SetPositionX(this.imageList[4].model.bottomLeftVertex.x);
      this.imageList[2].model.SetPositionY(this.imageList[4].model.bottomLeftVertex.y);

      this.imageList[3].model.SetPositionX(this.imageList[4].model.bottomRightVertex.x);
      this.imageList[3].model.SetPositionY(this.imageList[4].model.bottomRightVertex.y);
    }
  }

  SortImagesForAlphaBlending() {
    for(var i = 4; i < this.imageList.length; i++) {
      for(var j = 4; j < this.imageList.length; j++) {
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

    // Model picking detection
    if(input.IsMouseDown()) {
      console.log(input.GetMousePositionX() + ' ' + input.GetMouseRelativeY());
      var RGBA = this.framebufferPick.ReadPixel(glContext, input.GetMousePositionX(), canvas.height - input.GetMousePositionY());
      if (this.selectedID === -1) {
        for (var i = 0; i < this.imageList.length; i++) {
          if (this.imageList[i].model.GetID() === RGBA[0]) {
            this.selectedID = i;
            break;
          }
        }
      }
    }
    else {
      this.selectedID = -1;
    }

    // Handle input based on tool
    if(this.toolIndex === 0) {
      if(this.selectedID !== -1) {
        var posX = this.imageList[this.selectedID].model.posX;
        var posY = this.imageList[this.selectedID].model.posY;
        this.imageList[this.selectedID].model.SetPositionX(posX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[this.selectedID].model.SetPositionY(posY - (input.GetMouseRelativeY() * 0.0042));
      }
    }
    else if(this.toolIndex === 1){
      if(this.selectedID !== -1) {
        var rotZ = this.imageList[this.selectedID].model.rotZ;
        this.imageList[this.selectedID].model.SetRotationZ(rotZ + (input.GetMouseRelativeX() * 0.0024));
      }
    }
    else if(this.toolIndex === 2){
      if(this.selectedID !== -1) {
        var sclX = this.imageList[this.selectedID].model.sclX;
        var sclY = this.imageList[this.selectedID].model.sclY;
        this.imageList[this.selectedID].model.SetScaleX(sclX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[this.selectedID].model.SetScaleY(sclY + (input.GetMouseRelativeY() * 0.0024));
      }
    }
    else if(this.toolIndex === 3){
      // Allow movement of each quad if selected
      if(this.selectedID !== -1 && this.selectedID < 4) {
        var posX = this.imageList[this.selectedID].model.posX;
        var posY = this.imageList[this.selectedID].model.posY;
        this.imageList[this.selectedID].model.SetPositionX(posX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[this.selectedID].model.SetPositionY(posY - (input.GetMouseRelativeY() * 0.0042));
      }

      // Modify the position of each vertex of the selected layer based on the position of the control quad
      // TODO: Actually implement layers
      this.imageList[4].model.CornerPosition(glContext, this.imageList[0].model.posX, this.imageList[0].model.posY, 0);
      this.imageList[4].model.CornerPosition(glContext, this.imageList[1].model.posX, this.imageList[1].model.posY, 1);
      this.imageList[4].model.CornerPosition(glContext, this.imageList[2].model.posX, this.imageList[2].model.posY, 2);
      this.imageList[4].model.CornerPosition(glContext, this.imageList[3].model.posX, this.imageList[3].model.posY, 3);
    }
  }

  DrawScene(glContext, input, canvas) {
    this.ProcessLogic(glContext, input, canvas);

    // Draw scene to framebuffer for picking capability
    glContext.clearColor(1.0, 0.0, 0.0, 1.0);
    this.framebufferPick.Clear(glContext);
    this.framebufferPick.SetActive(glContext);

    // Bind the dummy texture in order to suppress shader warnings.
    this.dummyTexture.SetActive(glContext);

    for(var i = 0; i < this.imageList.length; i++) {
      // First 4 models are reserved for control quads.
      // Draw them to the framebuffer only if distort tool is enabled.
      if(i >= 4 || this.toolIndex === 3) {
        this.imageList[i].model.BindData(glContext);
        this.shader.SetActive(glContext);
        this.shader.UpdateUBO(glContext, 1.0, this.imageList[i].model.GetID() / 255.0);
        this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
        this.imageList[i].model.Render(glContext);
      }
    }

    this.framebufferPick.SetInactive(glContext);

    // Draw textured scene for regular viewer
    glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    this.shader.UpdateUBO(glContext, 0.0, 0.0);

    // First 4 models, which are reserved to the control quads, are drawn only if distort tool is enabled.
    for(var i = 4; i < this.imageList.length; i++) {
      this.imageList[i].model.BindData(glContext);
      this.shader.SetActive(glContext);
      this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
      this.imageList[i].texture.SetActive(glContext);
      this.imageList[i].model.Render(glContext);
    }

    // Draw the control quads if distort ool is enabled
    this.dummyTexture.SetActive(glContext);
    this.shader.UpdateUBO(glContext, 2.0, 0.0);
    if(this.toolIndex === 3) {
      for (var i = 0; i < 4; i++) {
        this.imageList[i].model.BindData(glContext);
        this.shader.SetActive(glContext);
        this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
        this.imageList[i].model.Render(glContext);
      }
    }
  }
}
