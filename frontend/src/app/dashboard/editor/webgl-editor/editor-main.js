"use strict";

const resourceMgrCls = require('./resourceManager.js');
const sceneMgrCls = require('./sceneManager.js');
const inputCls = require('./input.js');

class Renderer {
  Init() {
    console.log('Started initialization of WebGL editor!');

    this.canvas = document.getElementById('render-surface');

    var devicePixelRatio = window.devicePixelRatio || 1;
    var width = Math.floor(this.canvas.clientWidth * devicePixelRatio);
    var height = Math.floor(this.canvas.clientHeight * devicePixelRatio);

    this.canvas.width = width;
    this.canvas.height = height;
    this.glContext = this.canvas.getContext('webgl2', {preserveDrawingBuffer:true});

    if(!this.glContext) {
      console.log('Switching to experimental WebGL...');
      this.glContext = this.canvas.getContext('experimental-webgl');
    }

    if(!this.glContext) {
      alert('Your browser doesn\'t support WebGL rendering');
      return;
    }

    this.glContext.enable(this.glContext.DEPTH_TEST);
    this.glContext.enable(this.glContext.BLEND);
    this.glContext.blendFunc(this.glContext.SRC_ALPHA, this.glContext.ONE_MINUS_SRC_ALPHA);

    this.input = new inputCls.Input();
    this.input.Init(this.canvas);

    this.resourceManager = new resourceMgrCls.ResourceManager();
    this.resourceManager.AddResourceToQueue('assets/shaders/vertexShader.glsl');
    this.resourceManager.AddResourceToQueue('assets/shaders/fragmentShader.glsl');

    var rendererContext = this;
    this.resourceManager.StartResourceFetch(this.resourceManager, function() {rendererContext.LoadFinished();});

    this.sceneManager = new sceneMgrCls.SceneManager();
  }

  LoadFinished() {
    this.sceneManager.Init(this.glContext, this.canvas, this.resourceManager);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }

  RenderLoop() {
    this.sceneManager.DrawScene(this.glContext, this.input, this.canvas);

    // HACK - Prevent sliding while mousedown
    this.input.relX = 0;
    this.input.relY = 0;

    var rendererContext = this;
    requestAnimationFrame(function() {
      rendererContext.glContext.viewport(0, 0, rendererContext.glContext.drawingBufferWidth, rendererContext.glContext.drawingBufferHeight);
      rendererContext.RenderLoop();
    });
  }

  GetSceneManager() {
    return this.sceneManager;
  }
}

export default Renderer;

