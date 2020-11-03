import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordBillComponent } from './record-bill.component';

describe('RecordBillComponent', () => {
  let component: RecordBillComponent;
  let fixture: ComponentFixture<RecordBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
