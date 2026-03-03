import { Component, OnInit, inject } from '@angular/core'; // N'oublie pas OnInit
import { ActivatedRoute, Router } from '@angular/router';
import { DiscordAuthService } from '../../../../core/services/discord-auth.service';

@Component({
  selector: 'app-discord-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
})
export class AuthCallbackPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(DiscordAuthService);
  private router = inject(Router);

  ngOnInit() {
    // On s'abonne aux queryParams pour récupérer le code Discord
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!code) {
        console.error('No code in callback');
        this.router.navigate(['/']);
        return;
      }

      this.authService.exchangeCode({ code }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erreur auth Discord :', err);
          this.router.navigate(['/']);
        },
      });
    });
  }
}
