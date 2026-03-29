import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { DiscordAuthService } from 'src/app/core/services/discord-auth.service';
import { LoaderService } from 'src/app/core/services/loader.service'; // 1. Import du service

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
  private loaderService = inject(LoaderService); // 2. Injection du service

  isScrolled = false;
  isMenuOpen = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  loginWithDiscord() {
    // 3. On affiche le loader immédiatement
    this.loaderService.show();

    const url =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${this.env.discordClientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.env.discordRedirectUri)}` +
      `&scope=guilds.members.read+email+identify`;

    // 4. Redirection vers Discord
    window.location.href = url;

    // Optionnel : Sécurité au cas où la redirection est bloquée par le navigateur
    setTimeout(() => {
      this.loaderService.hide();
    }, 8000);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}