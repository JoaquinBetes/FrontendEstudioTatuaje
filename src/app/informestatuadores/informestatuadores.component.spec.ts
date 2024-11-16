import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesTatuadoresComponent } from './informestatuadores.component';

describe('InformesTatuadoresComponent', () => {
  let component: InformesTatuadoresComponent;
  let fixture: ComponentFixture<InformesTatuadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesTatuadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformesTatuadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
