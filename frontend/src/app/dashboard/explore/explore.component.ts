import {Component, OnInit, ViewChild} from '@angular/core';
import {DragScrollComponent} from 'ngx-drag-scroll';
import {setTimeout} from 'timers';
import {BackendService} from '../../backend.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  @ViewChild('latestAdded', {read: DragScrollComponent}) latestAddedDragScroll: DragScrollComponent;

  latestImages = [];
  mostRatedImages = [];

  searchName = '';
  searchStartDate = '2019-01-01';
  searchEndDate = '2019-12-24';
  searchMinRating = 0;
  searchMaxRating = 5;

  constructor(private backendService: BackendService, private authService: AuthService) { }

  ngOnInit() {
    this.backendService.getLatestPhotos(this.authService.getToken()).subscribe(res => {
      this.latestImages = <any>(res);
    });
    this.backendService.getMostRatedPhotos(this.authService.getToken()).subscribe(res => {
      this.mostRatedImages = <any>(res);
    });

    setTimeout(() => { this.latestAddedDragScroll.moveRight(); }, 1000);
  }

  onSearchClick() {

  }

}
