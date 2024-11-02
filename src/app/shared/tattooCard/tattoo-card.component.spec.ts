import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooCard } from './tattooCard.component';

describe('TattooCard', () => {
  let component: TattooCard;
  let fixture: ComponentFixture<TattooCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TattooCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
