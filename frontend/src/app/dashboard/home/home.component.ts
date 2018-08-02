import { Component, OnInit } from '@angular/core';
import {style, trigger, state, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('uploadBtnAnim', [
      state('init', style({
        backgroundColor: '#9563dd'
      })),
      state('color1', style({
        backgroundColor: '#9563dd'
      })),
      state('color2', style({
        backgroundColor: '#7180e1'
      })),
      transition('init => color1', animate('5ms')),
      transition('color1 => color2', animate('1000ms ease-in')),
      transition('color2 => color1', animate('1000ms ease-in'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  uploadBtnAnimState = 'init';

  constructor() { }

  ngOnInit() {
  }

  onAnimEnd(event) {
    if(this.uploadBtnAnimState === 'init') {
      this.uploadBtnAnimState = 'color1';
      return;
    }

    if(this.uploadBtnAnimState === 'color1') {
      this.uploadBtnAnimState = 'color2';
    } else {
      this.uploadBtnAnimState = 'color1';
    }
  }

}
