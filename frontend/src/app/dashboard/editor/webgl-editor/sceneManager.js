"use strict";

const cameraCls = require('./camera.js');
const modelCls = require('./model.js');
const textureCls = require('./texture.js');
const shaderCls = require('./shader.js');
const framePickCls = require('./framebufferPicking.js');
const controlQuadCls = require('./controlQuad.js');
const object3DCls = require('./object3D');
const object3DShaderCls = require('./object3DShader');
const objParserCls = require('wavefront-obj-parser');
const objExpanderCls = require('expand-vertex-data');
const object3DFramebufferCls = require('./object3DFramebuffer');

export class SceneManager {
  constructor() {
    this.selectedID = -1;
    this.selectedLayer = -1;
    this.textureLoadList = [];
    this.object3DLoadList = [];
    this.object3DFramebuffers = [];
    this.objects3D = [];
    this.imageList = [];
    this.toolIndex = 0;
    this.helperEnabled = false;
  }

  Init(glContext, canvas, resourceManager) {
    this.camera = new cameraCls.Camera();
    this.camera.Init(glContext, canvas);

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

    // Init Object3D shader
    this.object3DShader = new object3DShaderCls.Object3DShader();
    this.object3DShader.Init(glContext, resourceManager);

    // Init text overlay hooks
    this.overlayContainer = document.getElementById('render-overlay-container');

    // Helper labels
    this.helpers = [];

    for(var i = 0; i < 4; i++) {
      this.helpers[i] = {};

      this.helpers[i].view = document.createElement('div');
      this.helpers[i].view.className = 'overlay-child';
      this.helpers[i].text = document.createTextNode('');
      this.helpers[i].view.appendChild(this.helpers[i].text);
      this.overlayContainer.appendChild(this.helpers[i].view);
    }
  }

  NewObject3D(objData) {
    const parsedObj = objParserCls(objData);
    this.object3DLoadList.push(parsedObj);
  }

  NewTexture(textureName) {
    this.textureLoadList.push(textureName);
  }

  MapUpdateLayerListEvent(updateLayerListEvent) {
    this.UpdateLayerList = updateLayerListEvent;
  }

  ChangeTool(toolIndex) {
    this.toolIndex = toolIndex;

    // First time the distort tool gets selected, set the control quads to each corner of the selected layer
    this.ResetControlQuadsPosition();

    // Reset WasMouseClicked hack
    this.input.WasMouseClicked();
  }

  ToggleHelpers(toggle) {
    this.helperEnabled = toggle;
  }

  ResetControlQuadsPosition() {
    if(this.toolIndex === 3) {
      var selectedLayerIndex;
      if(this.selectedLayer !== -1) {
        for (selectedLayerIndex = 0; selectedLayerIndex < this.imageList.length; selectedLayerIndex++) {
          if (this.imageList[selectedLayerIndex].model.GetID() === this.selectedLayer) {
            break;
          }
        }
      }
      else {
        selectedLayerIndex = -1;
      }

      if(selectedLayerIndex !== -1) {
        this.imageList[0].model.SetPositionX(this.imageList[selectedLayerIndex].model.topLeftVertex.x);
        this.imageList[0].model.SetPositionY(this.imageList[selectedLayerIndex].model.topLeftVertex.y);

        this.imageList[1].model.SetPositionX(this.imageList[selectedLayerIndex].model.topRightVertex.x);
        this.imageList[1].model.SetPositionY(this.imageList[selectedLayerIndex].model.topRightVertex.y);

        this.imageList[2].model.SetPositionX(this.imageList[selectedLayerIndex].model.bottomLeftVertex.x);
        this.imageList[2].model.SetPositionY(this.imageList[selectedLayerIndex].model.bottomLeftVertex.y);

        this.imageList[3].model.SetPositionX(this.imageList[selectedLayerIndex].model.bottomRightVertex.x);
        this.imageList[3].model.SetPositionY(this.imageList[selectedLayerIndex].model.bottomRightVertex.y);
      }
    }
  }

  MoveLayer(id, directionUp) {
    var dirToggle;
    if(directionUp === true) {
      dirToggle = 1;
    }
    else {
      dirToggle = -1;
    }

    // Handle first or last layer based on direction
    if(this.imageList[this.imageList.length-1].model.GetID() === id && dirToggle === 1) {
      return;
    }
    else if(this.imageList[4].model.GetID() === id && dirToggle === -1) {
      return;
    }

    // Find the model based on id, and the model to be swapped with
    var i;
    for(i = 0; i < this.imageList.length; i++) {
      if(this.imageList[i].model.GetID() === id) {
        break;
      }
    }

    // Swap z-order with it's next index
    var aux = this.imageList[i+dirToggle].model.posZ;
    this.imageList[i+dirToggle].model.SetPositionZ(this.imageList[i].model.posZ);
    this.imageList[i].model.SetPositionZ(aux);

    // Swap object order
    aux = this.imageList[i+dirToggle];
    this.imageList[i+dirToggle] = this.imageList[i];
    this.imageList[i] = aux;
    this.UpdateLayerList(this.imageList.slice(4, this.imageList.length));
  }

  DeleteLayer(id) {
    var i;
    for(i = 0; i < this.imageList.length; i++) {
      if(this.imageList[i].model.GetID() === id) {
        break;
      }
    }

    this.imageList.splice(i, 1);
    this.UpdateLayerList(this.imageList.slice(4, this.imageList.length));
  }

  SetSelectedLayer(id) {
    this.selectedLayer = id;
    this.ResetControlQuadsPosition();
  }

  AdjustColor(id, hue, saturation, brightness) {
    var i;
    for(i = 0; i < this.imageList.length; i++) {
      if(this.imageList[i].model.GetID() === id) {
        break;
      }
    }

    this.imageList[i].layerInfo.hue = hue;
    this.imageList[i].layerInfo.saturation = saturation;
    this.imageList[i].layerInfo.brightness = brightness;
  }

  AdjustOverlay(id, enabled, r, g, b) {
    var i;
    for(i = 0; i < this.imageList.length; i++) {
      if(this.imageList[i].model.GetID() === id) {
        break;
      }
    }

    this.imageList[i].layerInfo.colorOverlay.enabled = enabled;
    this.imageList[i].layerInfo.colorOverlay.r = r;
    this.imageList[i].layerInfo.colorOverlay.g = g;
    this.imageList[i].layerInfo.colorOverlay.b = b;
  }

  AdjustOpacity(id, opacity) {
    var i;
    for(i = 0; i < this.imageList.length; i++) {
      if(this.imageList[i].model.GetID() === id) {
        break;
      }
    }

    this.imageList[i].layerInfo.opacity = opacity;
  }

  AddNewLayer() {
    this.textureLoadList.push('whiteTexture');
  }

  ProcessLogic(glContext, input, canvas) {
    this.input = input;

    // Handle loading of new images
    if(this.textureLoadList.length > 0) {
      var newImage = {};

      var newModel = new modelCls.Model();
      var newTexture = new textureCls.Texture();
      if(this.textureLoadList[0][0] === '~') {
        newModel.Init(glContext, this.shader.GetPipeline(), this.imageList.length, 500, 500, canvas);
        newModel.framebufferId = parseInt(this.textureLoadList[0][1]);
      } else {
        var image = document.getElementById(this.textureLoadList[0]);
        var width = image.naturalWidth;
        var height = image.naturalHeight;
        newModel.Init(glContext, this.shader.GetPipeline(), this.imageList.length, width, height, canvas);
        newTexture.Init(glContext, this.textureLoadList[0]);
      }
      newModel.SetPositionZ(-100.0+this.imageList.length);

      newImage.model = newModel;
      newImage.texture = newTexture;
      newImage.layerInfo = {};
      newImage.layerInfo.colorOverlay = {};
      this.imageList.push(newImage);

      newImage.layerInfo.name = 'Layer ' + (this.imageList.length - 4);
      if(this.textureLoadList[0].startsWith('~'))
        newImage.layerInfo.textureName = 'object3D';
      else
        newImage.layerInfo.textureName = this.textureLoadList[0];
      newImage.layerInfo.inverted = false;
      newImage.layerInfo.hue = 0.0;
      newImage.layerInfo.saturation = 0.99;
      newImage.layerInfo.brightness = 0.99;
      newImage.layerInfo.colorOverlay.enabled = false;
      newImage.layerInfo.colorOverlay.r = 0.0;
      newImage.layerInfo.colorOverlay.g = 0.0;
      newImage.layerInfo.colorOverlay.b = 0.0;
      newImage.layerInfo.opacity = 1.0;

      this.textureLoadList.pop();
      this.UpdateLayerList(this.imageList.slice(4, this.imageList.length));
    }

    // Handle loading of new models
    if(this.object3DLoadList.length > 0) {
      const objData = objExpanderCls(this.object3DLoadList[0], {facesToTriangles: true});

      this.textureLoadList.push('~' + this.objects3D.length);

      const framebuffer = new object3DFramebufferCls.Object3DFramebuffer();
      framebuffer.Init(glContext);
      this.object3DFramebuffers.push(framebuffer);

      const obj3d = new object3DCls.Object3D();
      obj3d.Init(glContext, this.object3DShader.GetPipeline(), objData);
      obj3d.SetRotationX(3.14159);
      this.objects3D.push(obj3d);

      this.object3DLoadList.pop();
    }

    // Model picking detection
    if(input.IsMouseDown()) {
      var RGBA = this.framebufferPick.ReadPixel(glContext, input.GetMousePositionX(), glContext.drawingBufferHeight - input.GetMousePositionY());
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

    // Get image index based on layer selection for tool manipulation purposes
    var selectedLayerIndex;
    if(this.selectedLayer !== -1) {
      for (selectedLayerIndex = 0; selectedLayerIndex < this.imageList.length; selectedLayerIndex++) {
        if (this.imageList[selectedLayerIndex].model.GetID() === this.selectedLayer) {
          break;
        }
      }
    }
    else {
      selectedLayerIndex = -1;
    }

    // Handle input based on tool
    if(this.toolIndex === 0) {
      if(input.IsMouseDown() && selectedLayerIndex !== -1) {
        var posX = this.imageList[selectedLayerIndex].model.posX;
        var posY = this.imageList[selectedLayerIndex].model.posY;
        this.imageList[selectedLayerIndex].model.SetPositionX(posX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[selectedLayerIndex].model.SetPositionY(posY - (input.GetMouseRelativeY() * 0.0042));
      }
    }
    else if(this.toolIndex === 1){
      if(input.IsMouseDown() && selectedLayerIndex !== -1) {
        var rotZ = this.imageList[selectedLayerIndex].model.rotZ;
        this.imageList[selectedLayerIndex].model.SetRotationZ(rotZ + (input.GetMouseRelativeX() * 0.0024));
      }
    }
    else if(this.toolIndex === 2){
      if(input.IsMouseDown() && selectedLayerIndex !== -1) {
        var sclX = this.imageList[selectedLayerIndex].model.sclX;
        var sclY = this.imageList[selectedLayerIndex].model.sclY;
        this.imageList[selectedLayerIndex].model.SetScaleX(sclX + (input.GetMouseRelativeX() * 0.0024));
        this.imageList[selectedLayerIndex].model.SetScaleY(sclY + (input.GetMouseRelativeY() * 0.0024));
      }
    }
    else if(this.toolIndex === 3) {
      if (selectedLayerIndex !== -1) {
        // Allow movement of each quad if selected
        if (this.selectedID !== -1 && this.selectedID < 4) {
          var posX = this.imageList[this.selectedID].model.posX;
          var posY = this.imageList[this.selectedID].model.posY;
          this.imageList[this.selectedID].model.SetPositionX(posX + (input.GetMouseRelativeX() * 0.0024));
          this.imageList[this.selectedID].model.SetPositionY(posY - (input.GetMouseRelativeY() * 0.0042));
        }

        // Modify the position of each vertex of the selected layer based on the position of the control quad
        this.imageList[selectedLayerIndex].model.CornerPosition(glContext, this.imageList[0].model.posX, this.imageList[0].model.posY, 0);
        this.imageList[selectedLayerIndex].model.CornerPosition(glContext, this.imageList[1].model.posX, this.imageList[1].model.posY, 1);
        this.imageList[selectedLayerIndex].model.CornerPosition(glContext, this.imageList[2].model.posX, this.imageList[2].model.posY, 2);
        this.imageList[selectedLayerIndex].model.CornerPosition(glContext, this.imageList[3].model.posX, this.imageList[3].model.posY, 3);
      }
    }
    else if(this.toolIndex === 4) {
      if(selectedLayerIndex !== -1 && input.WasMouseClicked()) {
        this.imageList[selectedLayerIndex].layerInfo.inverted = !this.imageList[selectedLayerIndex].layerInfo.inverted;
      }
    }
    else if(this.toolIndex === 10) {
      if(selectedLayerIndex !== -1 && input.IsMouseDown() && input.IsKeyDown('x')) {
        var objId = this.imageList[selectedLayerIndex].model.framebufferId;
        var rotY = this.objects3D[objId].rotY;
        this.objects3D[objId].SetRotationY(rotY + (input.GetMouseRelativeX() * 0.005));
      }
      else if(selectedLayerIndex !== -1 && input.IsMouseDown() && input.IsKeyDown('y')) {
        var objId = this.imageList[selectedLayerIndex].model.framebufferId;
        var rotX = this.objects3D[objId].rotX;
        this.objects3D[objId].SetRotationX(rotX + (input.GetMouseRelativeX() * 0.005));
      }
      else if(selectedLayerIndex !== -1 && input.IsMouseDown() && input.IsKeyDown('z')) {
        var objId = this.imageList[selectedLayerIndex].model.framebufferId;
        var rotZ = this.objects3D[objId].rotZ;
        this.objects3D[objId].SetRotationZ(rotZ + (input.GetMouseRelativeX() * 0.005));
      }
    }

    // Helpers logic
    if(this.helperEnabled) {
      if(selectedLayerIndex !== -1) {
        for(var i = 0; i < 4; i++) {
          var position = this.imageList[selectedLayerIndex].model.GetClipspaceVertex(glContext, this.camera, canvas, i);

          this.helpers[i].view.style.visibility = 'visible';
          this.helpers[i].view.style.fontWeight = 'bold';
          this.helpers[i].view.style.top = Math.floor(position.y) + 'px';
          this.helpers[i].view.style.left = Math.floor(position.x) + 'px';
          this.helpers[i].text.nodeValue = '(' + position.x.toFixed(1) + ',' + position.y.toFixed(1) + ')';
        }
      }
    } else {
      for(var i = 0; i < 4; i++) {
        this.helpers[i].view.style.visibility = 'hidden';
      }
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
        this.shader.UpdateUBO(glContext, 1.0, this.imageList[i].model.GetID() / 255.0, 0.0, 0.0);
        this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());
        this.imageList[i].model.Render(glContext);
      }
    }

    this.framebufferPick.SetInactive(glContext);

    // Draw object 3d framebuffers
    for(var i = 0; i < this.object3DFramebuffers.length; i++) {
      glContext.clearColor(0.0, 0.0, 0.0, 0.0);
      this.object3DFramebuffers[i].Clear(glContext);
      this.object3DFramebuffers[i].SetActive(glContext);

      this.objects3D[i].BindData(glContext);
      this.object3DShader.SetActive(glContext);
      this.object3DShader.UpdateParams(glContext, this.camera, this.objects3D[i].worldMatrix);
      this.objects3D[i].Render(glContext);

      this.object3DFramebuffers[i].SetInactive(glContext);
    }

    // Draw textured scene for regular viewer
    glContext.clearColor(0.7, 0.7, 0.7, 1.0);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    // First 4 models, which are reserved to the control quads, are drawn only if distort tool is enabled.
    for(var i = 4; i < this.imageList.length; i++) {
      if(this.imageList[i].layerInfo.colorOverlay.enabled) {
        this.shader.UpdateUBO(glContext, 4.0, this.imageList[i].layerInfo.colorOverlay.r, this.imageList[i].layerInfo.colorOverlay.g, this.imageList[i].layerInfo.colorOverlay.b);
      }
      else if(this.imageList[i].layerInfo.inverted) {
        this.shader.UpdateUBO(glContext, 3.0, this.imageList[i].layerInfo.hue, this.imageList[i].layerInfo.saturation, this.imageList[i].layerInfo.brightness);
      }
      else {
        this.shader.UpdateUBO(glContext, 0.0, this.imageList[i].layerInfo.hue, this.imageList[i].layerInfo.saturation, this.imageList[i].layerInfo.brightness);
      }

      this.shader.UpdateOpacityUBO(glContext, this.imageList[i].layerInfo.opacity);

      this.imageList[i].model.BindData(glContext);
      this.shader.SetActive(glContext);
      this.shader.UpdateParams(glContext, this.camera, this.imageList[i].model.GetWorldMatrix());

      if(this.imageList[i].model.framebufferId === -1)
        this.imageList[i].texture.SetActive(glContext);
      else
        glContext.bindTexture(glContext.TEXTURE_2D, this.object3DFramebuffers[this.imageList[i].model.framebufferId].textureColor);

      this.imageList[i].model.Render(glContext);
    }

    // Draw the control quads if distort tool is enabled
    this.dummyTexture.SetActive(glContext);
    this.shader.UpdateUBO(glContext, 2.0, 0.0, 0.0, 0.0);
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
