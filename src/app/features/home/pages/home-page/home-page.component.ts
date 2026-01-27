import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { GameOverviewComponent } from '../../components/game-overview/game-overview.component';
import { FeaturedRolesComponent } from '../../components/featured-roles/featured-roles.component';
import { StaffCarouselComponent } from '../../components/staff-carousel/staff-carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    GameOverviewComponent,
    FeaturedRolesComponent,
    StaffCarouselComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}
