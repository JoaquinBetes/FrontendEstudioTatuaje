import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HometatuadorComponent } from './hometatuador.component';

describe('HometatuadorComponent', () => {
  let component: HometatuadorComponent;
  let fixture: ComponentFixture<HometatuadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HometatuadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HometatuadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
