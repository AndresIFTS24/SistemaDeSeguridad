import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardngComponent } from './dashboard.component';

describe('DashboardngComponent', () => {
  let component: DashboardngComponent;
  let fixture: ComponentFixture<DashboardngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
