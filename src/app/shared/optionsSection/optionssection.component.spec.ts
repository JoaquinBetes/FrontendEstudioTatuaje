import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSectionComponent } from './optionsSection.component';

describe('OptionsSectionComponent', () => {
  let component: OptionsSectionComponent;
  let fixture: ComponentFixture<OptionsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
