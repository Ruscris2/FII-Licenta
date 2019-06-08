import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { style, trigger, state, transition, animate } from '@angular/animations';
import { AuthService } from '../../auth.service';
import { BackendService } from '../../backend.service';
import { setTimeout } from 'timers';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

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
        backgroundColor: '#ab60ca'
      })),
      transition('init => color1', animate('5ms')),
      transition('color1 => color2', animate('1000ms ease-in')),
      transition('color2 => color1', animate('3000ms ease-out'))
    ]),
    trigger('activityItemAnim', [
      state('step1', style({transform: 'translateY(30%)', opacity: 0.0})),
      state('step2', style({transform: 'translateY(0%)'})),
      transition('step1 => step2', animate('300ms ease-in')),
      transition('step2 => step1', animate('5ms'))
    ])
  ]
})
export class HomeComponent implements OnInit {

  @ViewChild('searchModal')
  private searchModalRef: ElementRef;

  uploadBtnAnimState = 'init';
  isLogged = true;
  activities = [];
  searchName = '';
  latestPhotoId = 1;

  constructor(private authService: AuthService, private backendService: BackendService, private modalService: NgbModal) {  }

  ngOnInit() {
    this.authService.isLogged().subscribe(res => {
      this.isLogged = res;
    });
    if(!this.isLogged) {
      return;
    }

    this.backendService.getActivities(this.authService.getToken()).subscribe(res => {
      this.activities = <any>(res);
      for(let i = 0; i < this.activities.length; i++) {
        this.activities[i].animState = 'step1';
        setTimeout(() => { this.activities[i].animState = 'step2';}, 5 + (i * 200));
      }
    });
    this.backendService.getLatestPhoto(this.authService.getToken()).subscribe(res => {
      this.latestPhotoId = (<any>res).id;
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

  openSearchModal() {
    this.modalService.open(this.searchModalRef,{ariaLabelledBy:'modal-basic-title', backdrop:false} as any).
    result.then((result)=> {
      // Modal always gets dismissed
    }, (reason) => {
    });
  }
}
