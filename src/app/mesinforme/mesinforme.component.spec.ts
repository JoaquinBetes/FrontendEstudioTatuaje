import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInformeComponent } from './mesinforme.component';

describe('MesInformeComponent', () => {
  let component: MesInformeComponent;
  let fixture: ComponentFixture<MesInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesInformeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
