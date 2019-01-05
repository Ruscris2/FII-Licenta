import { Component, OnInit } from '@angular/core';
import Renderer from './webgl-editor/editor-main';
import SceneManager from './webgl-editor/sceneManager';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  photoList = [];
  loadedPhotos = [];
  layerList = [];
  public selectedPhoto;
  rendererInstance = null;

  toolbox = [
    {'name':'move', 'img':'assets/images/cursor.png', 'selected':true},
    {'name':'rotate', 'img':'assets/images/rotate.png', 'selected':false},
    {'name':'scale', 'img':'assets/images/scale.png', 'selected':false},
    {'name':'distort', 'img':'assets/images/distort.png', 'selected':false}
  ];
  selectedToolIndex = 0;
  selectedLayerIndex = 0;

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    const context = this;

    this.authService.redirectInvalidSession();

    this.updatePhotoListView();

    this.rendererInstance = new Renderer();
    this.rendererInstance.Init();
    this.rendererInstance.GetSceneManager().MapUpdateLayerListEvent(function (list) {context.updateLayerListEvent(list);});
  }

  updateLayerListEvent(layerList) {
    this.layerList = layerList;
    this.layerList.reverse();

    for(let i = 0; i < this.layerList.length; i++) {
      this.layerList[i].selected = false;
    }
    this.layerList[0].selected = true;
    this.selectedLayerIndex = 0;
    this.rendererInstance.GetSceneManager().SetSelectedLayer(this.layerList[0].model.id);
  }

  onLayerUp(layer) {
    this.rendererInstance.GetSceneManager().MoveLayer(layer.model.id, true);
  }

  onLayerDown(layer) {
    this.rendererInstance.GetSceneManager().MoveLayer(layer.model.id, false);
  }

  onLayerDelete(layer) {
    this.rendererInstance.GetSceneManager().DeleteLayer(layer.model.id);
  }

  onLayerSelected(layer) {
    this.layerList[this.selectedLayerIndex].selected = false;

    for(let i = 0; i < this.layerList.length; i++) {
      if(this.layerList[i].model.id === layer.model.id) {
        this.layerList[i].selected = true;
        this.selectedLayerIndex = i;
        this.rendererInstance.GetSceneManager().SetSelectedLayer(layer.model.id);
        break;
      }
    }
  }

  updatePhotoListView() {
    this.backendService.getPhotoList(this.authService.getToken(), 1, 50, '').subscribe(res => {
      this.photoList = <any>res;

      // Process the list
      for(let i = 0; i < this.photoList.length; i++) {
        if(this.photoList[i].name.length > 23) {
          this.photoList[i].name = this.photoList[i].name.substr(0, 18) + '(...)';
        }
      }
    });
  }

  loadPhotoTexture() {
    this.loadedPhotos.push(this.selectedPhoto);
  }

  textureLoaded(photo) {
    const sceneManager = this.rendererInstance.GetSceneManager();
    sceneManager.NewTexture(photo);
  }

  onToolClick(tool) {
    this.toolbox[this.selectedToolIndex].selected = false;

    for(var i = 0; i < this.toolbox.length; i++) {
      if(tool.name === this.toolbox[i].name) {
        this.toolbox[i].selected = true;
        this.selectedToolIndex = i;
        break;
      }
    }

    const sceneManager = this.rendererInstance.GetSceneManager();
    sceneManager.ChangeTool(this.selectedToolIndex);
  }
}
