import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryEntryComponent } from './gallery-entry.component';

describe('GalleryEntryComponent', () => {
  let component: GalleryEntryComponent;
  let fixture: ComponentFixture<GalleryEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
