import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../../backend.service';
import { AuthService } from '../../../auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css'],
  animations: [
    trigger('glowAnim', [
      state('hidden', style({ 'box-shadow': '1px 1px 5px lightgray' })),
      state('visible', style({ 'box-shadow': '0px 0px 20px #0054ff'})),
      transition('hidden => visible', animate('150ms ease-in')),
      transition('visible => hidden', animate('150ms ease-out'))
    ])
  ]
})
export class FindComponent implements OnInit {
  name: any;
  startdate: any;
  enddate: any;
  minrating: any;
  maxrating: any;

  photoList = [];

  constructor(private route: ActivatedRoute, private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params['name'];
      this.startdate = params['startdate'];
      this.enddate = params['enddate'];
      this.minrating = params['minrating'];
      this.maxrating = params['maxrating'];

      this.updatePhotoListView();
    });
  }

  updatePhotoListView() {
    this.backendService.getPhotoList(this.authService.getToken(), 1, 50, '').subscribe(res => {
      this.photoList = <any>res;

      // Process the list
      for(let i = 0; i < this.photoList.length; i++) {
        if(this.photoList[i].name.length > 23) {
          this.photoList[i].name = this.photoList[i].name.substr(0, 18) + '(...)';
          this.photoList[i].animState = 'hidden';
        }
      }

    });
  }

  onHover(entry) {
    entry.animState = 'visible';
  }

  onHoverEnd(entry) {
    entry.animState = 'hidden';
  }
}
