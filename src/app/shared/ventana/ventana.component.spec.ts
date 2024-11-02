import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaComponent } from './ventana.component';

describe('VentanaComponent', () => {
  let component: VentanaComponent;
  let fixture: ComponentFixture<VentanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentanaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
