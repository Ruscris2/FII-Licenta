import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {BackendService} from '../../backend.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  photoList = [];

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.backendService.getPhotoList(this.authService.getToken(), 1, 50).subscribe(res => {
      this.photoList = <any>res;

      // Process the list
      for(let i = 0; i < this.photoList.length; i++) {
        if(this.photoList[i].name.length > 23) {
          this.photoList[i].name = this.photoList[i].name.substr(0, 18) + '(...)';
        }
      }
    });
  }

}
