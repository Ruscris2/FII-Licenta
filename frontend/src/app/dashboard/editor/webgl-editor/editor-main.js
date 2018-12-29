"use strict";

const resourceMgrCls = require('./resourceManager.js');
const sceneMgrCls = require('./sceneManager.js');

class Renderer {
  Init() {
    console.log('Started initialization of WebGL editor!');

    this.canvas = document.getElementById('render-surface');
    this.glContext = this.canvas.getContext('webgl2');

    if(!this.glContext) {
      console.log('Switching to experimental WebGL...');
      this.glContext = this.canvas.getContext('experimental-webgl');
    }

    if(!this.glContext) {
      alert('Your browser doesn\'t support WebGL rendering');
      return;
    }

    this.glContext.enable(this.glContext.DEPTH_TEST);

    this.resourceManager = new resourceMgrCls.ResourceManager();
    this.resourceManager.AddResourceToQueue('assets/shaders/vertexShader.glsl');
    this.resourceManager.AddResourceToQueue('assets/shaders/fragmentShader.glsl');

    var rendererContext = this;
    this.resourceManager.StartResourceFetch(this.resourceManager, function() {rendererContext.LoadFinished();});
  }

  LoadFinished() {
    this.sceneManager = new sceneMgrCls.SceneManager();
    this.sceneManager.Init(this.glContext, this.canvas, this.resourceManager);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }

  RenderLoop() {
    this.sceneManager.DrawScene(this.glContext);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }

  GetSceneManager() {
    return this.sceneManager;
  }
}

export default Renderer;

