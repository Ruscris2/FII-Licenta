import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../backend.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit, OnDestroy {
  @ViewChild('displayImage') displayImage: ElementRef;

  paramsSubscription: any;
  photo: any;
  accountInfo: any;
  shrinkHeader = true;
  ownerOptionsVisible = false;
  displayRatedInfo = false;
  displayCommentedInfo = false;
  commentBoxText = '';
  comments = [];
  faces = [];

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

      this.backendService.commentList(this.authService.getToken(), id).subscribe(res => {
        this.comments = <any>res;
        window.scroll(0, 0);
      });
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

        const faceArguments = this.photo.faceData.split(';');
        const faceTags = this.photo.faceTags.split(';');
        const facesCount = Math.floor(faceArguments.length / 4);

        let seed = 2;
        for(let i = 0; i < facesCount; i++) {
          const randomR = Math.sin(seed++) * 10000;
          const randomG = Math.sin(seed++) * 10000;
          const randomB = Math.sin(seed++) * 10000;

          const face = {
            x: faceArguments[i*4],
            y: faceArguments[i*4+1],
            width: faceArguments[i*4+2],
            height: faceArguments[i*4+3],
            viewLeft: 0,
            viewTop: 0,
            viewWidth: 0,
            viewHeight: 0,
            visible: 'hidden',
            r: (Math.floor(randomR) % 255),
            g: (Math.floor(randomG) % 255),
            b: (Math.floor(randomB) % 255),
            tag: faceTags[i]
          };

          this.faces.push(face);
        }
      });
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  onPresentationMouseEnter(event) {
    this.shrinkHeader = false;

    setTimeout(() => {
      for(let i = 0; i < this.faces.length; i++) {
        const leftWeight = (this.displayImage.nativeElement.width / this.displayImage.nativeElement.naturalWidth);
        const topWeight = (this.displayImage.nativeElement.height / this.displayImage.nativeElement.naturalHeight);

        this.faces[i].viewLeft = event.srcElement.offsetLeft + (this.faces[i].x * leftWeight);
        this.faces[i].viewTop = event.srcElement.offsetTop + (this.faces[i].y * topWeight);
        this.faces[i].viewWidth = this.faces[i].width * leftWeight;
        this.faces[i].viewHeight = this.faces[i].height * topWeight;

        this.faces[i].visible = 'visible';
      }
    }, 100);
  }

  onTagTextChanged() {
      let tags = '';
      for (let i = 0; i < this.faces.length; i++) {
        tags += this.faces[i].tag + ';';
      }

      this.backendService.updatePhotoTags(this.authService.getToken(), this.photo.id, tags).subscribe(res => {
      });
  }

  onPresentationMouseLeave() {
    this.shrinkHeader = true;

    for(let i = 0; i < this.faces.length; i++) {
      this.faces[i].visible = 'hidden';
    }
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
    }, 800);

    this.backendService.ratePhoto(this.authService.getToken(), this.photo.id, starId).subscribe(res => {
      this.getPhotoInfoFromBackend(this.photo.id);
    });
  }

  onCommentClick() {
    if(this.commentBoxText.length === 0) {
      alert('Please enter a comment in the text area above!');
      return;
    }

    this.displayCommentedInfo = true;

    setTimeout(() => {
      this.displayCommentedInfo = false;
    }, 800);

    this.backendService.commentPhoto(this.authService.getToken(), this.photo.id, this.commentBoxText).subscribe(dummy => {
      this.backendService.commentList(this.authService.getToken(), this.photo.id).subscribe(res => {
        this.comments = <any>res;
      });
    });
    this.commentBoxText = '';
  }
}
