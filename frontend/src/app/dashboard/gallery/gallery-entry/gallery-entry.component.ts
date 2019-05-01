import {Component, Input, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {Time} from '@angular/common';

@Component({
  selector: 'app-gallery-entry',
  templateUrl: './gallery-entry.component.html',
  styleUrls: ['./gallery-entry.component.css'],
  animations: [
    trigger('glowAnim', [
      state('hidden', style({ 'box-shadow': 'none' })),
      state('visible', style({ 'box-shadow': '0px 0px 20px #0054ff'})),
      transition('hidden => visible', animate('150ms ease-in')),
      transition('visible => hidden', animate('150ms ease-out'))
    ])
  ]
})
export class GalleryEntryComponent implements OnInit {
  animState = 'hidden';

  @Input() thumbnail: string;
  @Input() photoname: string;
  @Input() rating: any;
  @Input() timeAdded: string;

  constructor() { }

  ngOnInit() {
  }

  onHover() {
    this.animState = 'visible';
  }

  onHoverEnd() {
    this.animState = 'hidden';
  }
}
