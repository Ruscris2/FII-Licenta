import { Component, OnInit } from '@angular/core';
import { style, trigger, state, transition, animate } from '@angular/animations';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('uploadBtnAnim', [
      state('init', style({
        backgroundColor: '#7180ff'
      })),
      state('color1', style({
        backgroundColor: '#7180ff'
      })),
      state('color2', style({
        backgroundColor: '#6160ca'
      })),
      transition('init => color1', animate('5ms')),
      transition('color1 => color2', animate('1000ms ease-in')),
      transition('color2 => color1', animate('1000ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  uploadBtnAnimState = 'init';
  isLogged = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.isLogged().then(res => {
      this.isLogged = res;
    });
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
