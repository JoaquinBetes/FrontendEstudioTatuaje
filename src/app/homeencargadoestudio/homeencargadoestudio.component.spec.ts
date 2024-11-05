import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEncargadoEstudioComponent } from './homeencargadoestudio.component';

describe('HomeEncargadoEstudioComponent', () => {
  let component: HomeEncargadoEstudioComponent;
  let fixture: ComponentFixture<HomeEncargadoEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEncargadoEstudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEncargadoEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
