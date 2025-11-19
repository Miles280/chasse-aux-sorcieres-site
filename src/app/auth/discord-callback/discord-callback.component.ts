import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscordAuthService } from '../services/discord-auth.service';

@Component({
  selector: 'app-discord-callback',
  standalone: true,
  imports: [],
  templateUrl: './discord-callback.component.html',
  styleUrl: './discord-callback.component.css',
})
export class DiscordCallbackComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(DiscordAuthService);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!code) {
        console.error('No code in callback');
        return;
      }

      this.authService.exchangeCode(code).subscribe({
        next: (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.token);
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
