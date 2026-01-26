import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiscordAuthService } from '../auth/services/discord-auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private env = environment;
  public authService = inject(DiscordAuthService);

  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fermer le menu quand on clique sur un lien
  closeMenu() {
    this.isMenuOpen = false;
  }

  loginWithDiscord() {
    const url =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${this.env.discordClientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.env.discordRedirectUri)}` +
      `&scope=guilds.members.read+email+identify`;

    window.location.href = url;
  }

  logout() {
    this.authService.logout();
  }
}
