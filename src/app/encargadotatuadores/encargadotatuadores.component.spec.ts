import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncargadoTatuadoresComponent } from './encargadotatuadores.component';

describe('EncargadoTatuadoresComponent', () => {
  let component: EncargadoTatuadoresComponent;
  let fixture: ComponentFixture<EncargadoTatuadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncargadoTatuadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncargadoTatuadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
