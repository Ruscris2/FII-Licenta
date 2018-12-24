import { Component, OnInit } from '@angular/core';
import Renderer from './editor-main'

declare var InitEditor: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const rendererInstance = new Renderer();
    rendererInstance.Init();
  }

}
