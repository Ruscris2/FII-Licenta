import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuploadsComponent } from './newuploads.component';

describe('NewuploadsComponent', () => {
  let component: NewuploadsComponent;
  let fixture: ComponentFixture<NewuploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewuploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewuploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
