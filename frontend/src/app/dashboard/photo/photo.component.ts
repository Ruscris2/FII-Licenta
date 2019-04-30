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
  displayRatedInfo = false;

  ratingStars = [
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png'
  ];
  ratingStarsVisual = [
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png',
    'assets/images/star_empty.png'
  ];

  constructor(private route: ActivatedRoute, private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      const id = +params['id'];

      this.getPhotoInfoFromBackend(id);
    });
  }

  getPhotoInfoFromBackend(photoId) {
    this.backendService.getSinglePhoto(this.authService.getToken(), photoId).subscribe(res => {
      this.photo = res;

      this.backendService.accountInfo(this.authService.getToken()).subscribe(accountRes => {
        this.accountInfo = accountRes;
        if(this.accountInfo.id === this.photo.ownerId) {
          this.ownerOptionsVisible = true;
        }
        if(this.photo.description == null) {
          this.photo.description = '(no description available)';
        }

        this.setupStarsFromRating(this.photo.rating);
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

  onHoverStar(starId) {
    const starRating = 'assets/images/star_rating.png';

    for(let i = 0; i < starId; i++) {
      this.ratingStarsVisual[i] = starRating;
    }
    for(let i = starId; i < 5; i++) {
      this.ratingStarsVisual[i] = this.ratingStars[i];
    }
  }

  onLeaveStar() {
    this.setupStarsFromRating(this.photo.rating);
  }

  setupStarsFromRating(rating) {
    const starEmpty = 'assets/images/star_empty.png';
    const starHalf = 'assets/images/star_half.png';
    const starFull = 'assets/images/star_full.png';

    for(let i = 0; i < Math.floor(rating); i++) {
      this.ratingStars[i] = starFull;
    }

    for(let i = Math.floor(rating); i < 5; i++) {
      this.ratingStars[i] = starEmpty;
    }

    if((rating - Math.floor(rating)) > 0) {
      this.ratingStars[Math.floor(rating)] = starHalf;
    }

    for(let i = 0; i < 5; i++) {
      this.ratingStarsVisual[i] = this.ratingStars[i];
    }
  }

  onRatingStarClicked(starId) {
    this.displayRatedInfo = true;

    setTimeout(() => {
      this.displayRatedInfo = false;
    }, 500);

    this.backendService.ratePhoto(this.authService.getToken(), this.photo.id, starId).subscribe(res => {
      this.getPhotoInfoFromBackend(this.photo.id);
    });
  }
}
