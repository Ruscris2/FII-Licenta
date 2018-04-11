import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountboxComponent } from './accountbox.component';

describe('AccountboxComponent', () => {
  let component: AccountboxComponent;
  let fixture: ComponentFixture<AccountboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
