import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { GameOverviewSectionComponent } from '../../components/game-overview-section/game-overview-section.component';
import { RolesPreviewSectionComponent } from '../../components/roles-preview-section/roles-preview-section.component';
import { StaffSectionComponent } from '../../components/staff-section/staff-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    GameOverviewSectionComponent,
    RolesPreviewSectionComponent,
    StaffSectionComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
