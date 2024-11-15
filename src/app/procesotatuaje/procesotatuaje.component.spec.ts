import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesotatuajeComponent } from './procesotatuaje.component';

describe('ProcesotatuajeComponent', () => {
  let component: ProcesotatuajeComponent;
  let fixture: ComponentFixture<ProcesotatuajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesotatuajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesotatuajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
