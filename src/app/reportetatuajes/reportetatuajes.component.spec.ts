import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTatuajesComponent } from './reportetatuajes.component';

describe('ReporteTatuajesComponent', () => {
  let component: ReporteTatuajesComponent;
  let fixture: ComponentFixture<ReporteTatuajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteTatuajesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteTatuajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
