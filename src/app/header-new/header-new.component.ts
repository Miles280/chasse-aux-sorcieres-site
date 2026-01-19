import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiscordAuthService } from '../auth/services/discord-auth.service';

@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-new.component.html',
  styleUrl: './header-new.component.css'
})
export class HeaderNewComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  DiscordAuthService = inject(DiscordAuthService);
}