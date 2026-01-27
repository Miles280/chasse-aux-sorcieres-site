import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCarouselComponent } from './staff-carousel.component';

describe('StaffCarouselComponent', () => {
  let component: StaffCarouselComponent;
  let fixture: ComponentFixture<StaffCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
