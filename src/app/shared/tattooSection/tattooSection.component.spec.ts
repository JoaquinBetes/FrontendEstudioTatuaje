import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TattooSection } from './tattooSection.component';

describe('TattooSection', () => {
  let component: TattooSection;
  let fixture: ComponentFixture<TattooSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TattooSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
