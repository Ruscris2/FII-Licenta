import {Component, OnInit, ViewChild} from '@angular/core';
import {DragScrollComponent} from 'ngx-drag-scroll';
import {AuthService} from '../../auth.service';
import {BackendService} from '../../backend.service';

@Component({
  selector: 'app-newuploads',
  templateUrl: './newuploads.component.html',
  styleUrls: ['./newuploads.component.css']
})
export class NewuploadsComponent implements OnInit {
  @ViewChild('uploadScroll', {read: DragScrollComponent}) uploadScroll: DragScrollComponent;

  latestUploads = [];

  constructor(private authService: AuthService, private backendService: BackendService) { }

  ngOnInit() {
    this.backendService.getNewlyUploaded(this.authService.getToken()).subscribe(res => {
      this.latestUploads = <any>res;
    });
  }

  leftClick() {
    this.uploadScroll.moveLeft();
  }

  rightClick() {
    this.uploadScroll.moveRight();
  }
}
