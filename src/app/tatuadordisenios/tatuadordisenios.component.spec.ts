import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TatuadorDiseniosComponent } from './tatuadordisenios.component';

describe('TatuadorDiseniosComponent', () => {
  let component: TatuadorDiseniosComponent;
  let fixture: ComponentFixture<TatuadorDiseniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TatuadorDiseniosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TatuadorDiseniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
