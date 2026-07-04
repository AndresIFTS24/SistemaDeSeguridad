import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicaComponent } from './tecnica.component';

describe('TecnicaComponent', () => {
  let component: TecnicaComponent;
  let fixture: ComponentFixture<TecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
