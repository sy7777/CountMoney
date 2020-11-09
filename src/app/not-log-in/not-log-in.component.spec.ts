import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLogInComponent } from './not-log-in.component';

describe('NotLogInComponent', () => {
  let component: NotLogInComponent;
  let fixture: ComponentFixture<NotLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotLogInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
