import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layout/footer/footer.component';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { DiscordAuthService } from './core/services/discord-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chasse-aux-sorcieres-site';

  // Injection volontaire : force l'initialisation de la session
  // (restauration du token, refresh silencieux, timer proactif)
  // dès le démarrage de l'app, sans dépendre d'un autre composant.
  private authService = inject(DiscordAuthService);
}
