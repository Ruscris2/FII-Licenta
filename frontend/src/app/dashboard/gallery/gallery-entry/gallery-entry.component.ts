import {Component, Input, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-gallery-entry',
  templateUrl: './gallery-entry.component.html',
  styleUrls: ['./gallery-entry.component.css'],
  animations: [
    trigger('glowAnim', [
      state('hidden', style({ 'box-shadow': 'none', 'transform': 'scale(1.0) rotate(0deg)' })),
      state('visible', style({ 'box-shadow': '0px 0px 20px #0054ff', 'transform': 'scale(1.2) rotate(7deg)'})),
      transition('hidden => visible', animate('150ms ease-in')),
      transition('visible => hidden', animate('150ms ease-out'))
    ])
  ]
})
export class GalleryEntryComponent implements OnInit {
  animState = 'hidden';

  @Input() thumbnail: string;
  @Input() photoname: string;

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
