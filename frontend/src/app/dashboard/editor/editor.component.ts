import { Component, OnInit } from '@angular/core';
import Renderer from './webgl-editor/editor-main';
import SceneManager from './webgl-editor/sceneManager';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  photoList = [];
  loadedPhotos = [];
  public selectedPhoto;
  rendererInstance = null;

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.redirectInvalidSession();

    this.updatePhotoListView();

    this.rendererInstance = new Renderer();
    this.rendererInstance.Init();
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
}
