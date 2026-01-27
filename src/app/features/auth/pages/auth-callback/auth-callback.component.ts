import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscordAuthService } from '../../../../core/services/discord-auth.service';

@Component({
  selector: 'app-discord-callback',
  standalone: true,
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
})
export class AuthCallbackPageComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(DiscordAuthService);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!code) {
        console.error('No code in callback');
        this.router.navigate(['/login']);
        return;
      }

      this.authService.exchangeCode({ code }).subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.token);
          this.authService.saveRefreshToken(response.refreshToken);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erreur auth Discord :', err);
          this.router.navigate(['/login']);
        },
      });
    });
  }
}
