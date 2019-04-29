import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit, OnDestroy {

  paramsSubscription: any;
  photo: any;
  accountInfo: any;
  shrinkHeader = true;
  ownerOptionsVisible = false;

  constructor(private route: ActivatedRoute, private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      const id = +params['id'];

      this.backendService.getSinglePhoto(this.authService.getToken(), id).subscribe(res => {
        this.photo = res;

        this.backendService.accountInfo(this.authService.getToken()).subscribe(accountRes => {
          this.accountInfo = accountRes;
          if(this.accountInfo.id === this.photo.ownerId) {
            this.ownerOptionsVisible = true;

            if(this.photo.description == null) {
              this.photo.description = '(no description available)';
            }
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  onPresentationMouseEnter() {
    this.shrinkHeader = false;
  }

  onPresentationMouseLeave() {
    this.shrinkHeader = true;
  }
}
