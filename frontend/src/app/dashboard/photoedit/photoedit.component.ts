import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { BackendService } from '../../backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photoedit',
  templateUrl: './photoedit.component.html',
  styleUrls: ['./photoedit.component.css']
})
export class PhotoeditComponent implements OnInit {

  paramsSubscription: any;
  photo: any;
  photoName: string;
  photoDesc: string;
  constructor(private route: ActivatedRoute, private backendService: BackendService, private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      const id = +params['id'];

      this.backendService.getSinglePhoto(this.authService.getToken(), id).subscribe(res => {
        this.photo = res;

        this.photoName = this.photo.name;
        this.photoDesc = this.photo.description;
      });
    });
  }

  onSaveClick() {
    this.backendService.editSinglePhoto(this.authService.getToken(), this.photo.id, this.photoName, this.photoDesc).subscribe(res => {
      this.router.navigate(['/photo', this.photo.id]);
    });
  }
}
