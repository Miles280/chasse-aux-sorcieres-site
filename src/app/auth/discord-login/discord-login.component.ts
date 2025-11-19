import { Component } from '@angular/core';

@Component({
  selector: 'app-discord-login',
  standalone: true,
  imports: [],
  templateUrl: './discord-login.component.html',
  styleUrl: './discord-login.component.css',
})
export class DiscordLoginComponent {
  private clientId = '1440736031786799104';
  private redirectUri = 'http://localhost:4200/auth/discord/callback';

  loginWithDiscord() {
    const url =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${this.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&scope=identify%20email`;

    window.location.href = url;
  }
}
