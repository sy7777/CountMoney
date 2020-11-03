import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAnalysisComponent } from './bill-analysis.component';

describe('BillAnalysisComponent', () => {
  let component: BillAnalysisComponent;
  let fixture: ComponentFixture<BillAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
