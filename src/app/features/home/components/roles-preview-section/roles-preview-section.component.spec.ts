import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPreviewSectionComponent } from './roles-preview-section.component';

describe('FeaturedRolesComponent', () => {
  let component: RolesPreviewSectionComponent;
  let fixture: ComponentFixture<RolesPreviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPreviewSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesPreviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
