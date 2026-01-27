import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedRolesComponent } from './featured-roles.component';

describe('FeaturedRolesComponent', () => {
  let component: FeaturedRolesComponent;
  let fixture: ComponentFixture<FeaturedRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
