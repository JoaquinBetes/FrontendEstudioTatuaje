import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientediseniosComponent } from './clientedisenios.component';

describe('ClientediseniosComponent', () => {
  let component: ClientediseniosComponent;
  let fixture: ComponentFixture<ClientediseniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientediseniosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientediseniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
