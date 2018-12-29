"use strict";

const sceneMgrCls = require('./sceneManager.js');

class Renderer {
  Init() {
    console.log('Started initialization of WebGL editor!');

    var canvas = document.getElementById('render-surface');
    this.glContext = canvas.getContext('webgl');

    if(!this.glContext) {
      console.log('Switching to experimental WebGL...');
      this.glContext = canvas.getContext('experimental-webgl');
    }

    if(!this.glContext) {
      alert('Your browser doesn\'t support WebGL rendering');
      return;
    }

    this.glContext.enable(this.glContext.DEPTH_TEST);

    this.sceneManager = new sceneMgrCls.SceneManager();
    this.sceneManager.Init(this.glContext, canvas);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }

  RenderLoop() {
    this.sceneManager.DrawScene(this.glContext);

    var rendererContext = this;
    requestAnimationFrame(function() {rendererContext.RenderLoop();});
  }
}

export default Renderer;

