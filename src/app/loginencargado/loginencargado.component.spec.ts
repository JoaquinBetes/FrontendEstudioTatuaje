import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEncargadoComponent } from './loginencargado.component';

describe('LoginEncargadoComponent', () => {
  let component: LoginEncargadoComponent;
  let fixture: ComponentFixture<LoginEncargadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginEncargadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
