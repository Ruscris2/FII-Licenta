import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoeditComponent } from './photoedit.component';

describe('PhotoeditComponent', () => {
  let component: PhotoeditComponent;
  let fixture: ComponentFixture<PhotoeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
