import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Renderer from './webgl-editor/editor-main';
import SceneManager from './webgl-editor/sceneManager';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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

  hueValue = 0;
  saturationValue = 0;
  brightnessValue = 0;
  redValue = 0;
  greenValue = 0;
  blueValue = 0;
  overlayEnabled = false;
  opacityValue = 0;
  helperEnabled = false;

  @ViewChild('colorAdjustmentModal')
  private colorAdjustmentModalRef: ElementRef;
  @ViewChild('rgbOverlayModal')
  private rgbOverlayModalRef: ElementRef;
  @ViewChild('opacityModal')
  private opacityModalRef: ElementRef;
  @ViewChild('uploadModel')
  private uploadModelRedirect: ElementRef;

  toolbox = [
    {'name':'move', 'img':'assets/images/cursor.png', 'selected':true},
    {'name':'rotate', 'img':'assets/images/rotate.png', 'selected':false},
    {'name':'scale', 'img':'assets/images/scale.png', 'selected':false},
    {'name':'distort', 'img':'assets/images/distort.png', 'selected':false},
    {'name':'invert', 'img':'assets/images/invert.png', 'selected':false},
    {'name':'hsv', 'img':'assets/images/hsv.png', 'selected':false},
    {'name':'overlay', 'img':'assets/images/overlay.png', 'selected':false},
    {'name':'opacity', 'img':'assets/images/opacity.png', 'selected':false},
    {'name':'helpers', 'img':'assets/images/helpers.png', 'selected':false},
    {'name':'3dobj', 'img':'assets/images/3dobj.png', 'selected':false},
    {'name':'objrot', 'img':'assets/images/objrot.png', 'selected':false}
  ];
  selectedToolIndex = 0;
  selectedLayerIndex = -1;

  constructor(private backendService: BackendService, private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit() {
    const context = this;

    this.authService.redirectInvalidSession();

    this.updatePhotoListView();

    this.rendererInstance = new Renderer();
    this.rendererInstance.Init();
    this.rendererInstance.GetSceneManager().MapUpdateLayerListEvent(function (list) {context.updateLayerListEvent(list);});
  }

  openColorAdjustmentModal() {
    if(this.selectedLayerIndex === -1) {
      return;
    }

    // Set the modal sliders to actual layer positions
    this.hueValue = this.layerList[this.selectedLayerIndex].layerInfo.hue * 100;
    this.saturationValue = this.layerList[this.selectedLayerIndex].layerInfo.saturation * 100;
    this.brightnessValue = this.layerList[this.selectedLayerIndex].layerInfo.brightness * 100;

    this.modalService.open(this.colorAdjustmentModalRef, {ariaLabelledBy:'modal-basic-title', backdrop:false} as any).
    result.then((result)=>{
      // Modal always gets dismissed
    }, (reason) => {
      // Change back to move tool when dismissed from hsv adjustment
      this.onToolClick(this.toolbox[0]);
    });
  }

  openRGBOverlayModal() {
    if(this.selectedLayerIndex === -1) {
      return;
    }

    this.modalService.open(this.rgbOverlayModalRef, { ariaLabelledBy: 'modal-basic-title', backdrop: false } as any).
    result.then((result) => {
      // Modal always gets dismissed
    }, (reason) => {
      // Change back to move tool when dismissed from hsv adjustment
      this.onToolClick(this.toolbox[0]);
    });
  }

  openOpacityModal() {
    if(this.selectedLayerIndex === -1) {
      return;
    }

    this.opacityValue = this.layerList[this.selectedLayerIndex].layerInfo.opacity * 100;

    this.modalService.open(this.opacityModalRef, { ariaLabelledBy: 'modal-basic-title', backdrop: false } as any).
    result.then((result) => {
      // Modal always gets dismissed
    }, (reason) => {
      // Change back to move tool when dismissed from hsv adjustment
      this.onToolClick(this.toolbox[0]);
    });
  }

  updateLayerListEvent(layerList) {
    this.layerList = layerList;
    this.layerList.reverse();

    // TODO: this will probably crash when layer list is updated with an empty list
    for(let i = 0; i < this.layerList.length; i++) {
      this.layerList[i].selected = false;
      if(this.layerList[i].layerInfo.textureName === 'whiteTexture') {
        this.layerList[i].layerInfo.textureName = 'assets/images/white.png';
      } else if(this.layerList[i].layerInfo.textureName === 'object3D') {
        this.layerList[i].layerInfo.textureName = 'assets/images/3dobj.png';
      }
    }
    this.layerList[0].selected = true;
    this.selectedLayerIndex = 0;
    this.rendererInstance.GetSceneManager().SetSelectedLayer(this.layerList[0].model.id);
  }

  onHSVSliderChange() {
    this.rendererInstance.GetSceneManager().AdjustColor(this.layerList[this.selectedLayerIndex].model.id,
      this.hueValue / 100, this.saturationValue / 100, this.brightnessValue / 100);
  }

  onRGBOverlayChange() {
    this.rendererInstance.GetSceneManager().AdjustOverlay(this.layerList[this.selectedLayerIndex].model.id, this.overlayEnabled,
      this.redValue / 100, this.greenValue / 100, this.blueValue / 100);
  }

  onOpacityChange() {
    this.rendererInstance.GetSceneManager().AdjustOpacity(this.layerList[this.selectedLayerIndex].model.id, this.opacityValue / 100);
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

  onAddNewLayerClick() {
    this.rendererInstance.GetSceneManager().AddNewLayer();
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

  onUploadModelClick() {
    const file = (<HTMLInputElement>document.getElementById('uploadModel')).files[0];

    const thisClass = this;
    const reader = new FileReader();
    reader.onload = function () {
      thisClass.rendererInstance.GetSceneManager().NewObject3D(reader.result);
    };

    reader.readAsText(file);
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

    for(let i = 0; i < this.toolbox.length; i++) {
      if(tool.name === this.toolbox[i].name) {
        this.toolbox[i].selected = true;
        this.selectedToolIndex = i;
        break;
      }
    }

    const sceneManager = this.rendererInstance.GetSceneManager();
    sceneManager.ChangeTool(this.selectedToolIndex);

    if(this.selectedToolIndex === 5) {
      if(this.selectedLayerIndex !== -1) {
        this.openColorAdjustmentModal();
      } else {
        this.onToolClick(this.toolbox[0]);
      }
    }

    if(this.selectedToolIndex === 6) {
      if(this.selectedLayerIndex !== -1) {
        this.openRGBOverlayModal();
      } else {
        this.onToolClick(this.toolbox[0]);
      }
    }

    if(this.selectedToolIndex === 7) {
      if(this.selectedLayerIndex !== -1) {
        this.openOpacityModal();
      } else {
        this.onToolClick(this.toolbox[0]);
      }
    }

    if(this.selectedToolIndex === 8) {
      this.helperEnabled = !this.helperEnabled;
      this.rendererInstance.GetSceneManager().ToggleHelpers(this.helperEnabled);
      this.onToolClick(this.toolbox[0]);
    }

    if(this.selectedToolIndex === 9) {
      this.uploadModelRedirect.nativeElement.value = '';
      this.uploadModelRedirect.nativeElement.click();
      this.onToolClick(this.toolbox[0]);
    }
  }
}
