import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteTurnoComponent } from './clienteturno.component';

describe('ClienteTurnoComponent', () => {
  let component: ClienteTurnoComponent;
  let fixture: ComponentFixture<ClienteTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteTurnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
