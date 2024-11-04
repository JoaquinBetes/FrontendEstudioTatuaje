import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeclienteComponent } from './homecliente.component';

describe('HomeclienteComponent', () => {
  let component: HomeclienteComponent;
  let fixture: ComponentFixture<HomeclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeclienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
