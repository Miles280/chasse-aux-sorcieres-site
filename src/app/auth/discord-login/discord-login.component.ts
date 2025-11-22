import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-discord-login',
  standalone: true,
  imports: [],
  templateUrl: './discord-login.component.html',
  styleUrl: './discord-login.component.css',
})
export class DiscordLoginComponent {
  private env = environment;

  loginWithDiscord() {
    const url =
      `https://discord.com/oauth2/authorize` +
      `?client_id=${this.env.discordClientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.env.discordRedirectUri)}` +
      `&scope=guilds.members.read+email+identify`;

    window.location.href = url;
  }
}
