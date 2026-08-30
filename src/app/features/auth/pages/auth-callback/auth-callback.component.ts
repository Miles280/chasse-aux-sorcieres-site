import { Component, OnInit, inject } from '@angular/core'; // N'oublie pas OnInit
import { ActivatedRoute, Router } from '@angular/router';
import { DiscordAuthService } from '../../../../core/services/discord-auth.service';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-discord-callback',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
})
export class AuthCallbackPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(DiscordAuthService);
  private router = inject(Router);
  private loader = inject(LoaderService);

  ngOnInit() {
    // On s'abonne aux query
    // Params pour récupérer le code Discord
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (!code) {
        this.loader.hide();
        console.error('No code in callback');
        this.router.navigate(['/']);
        return;
      }

      this.authService.exchangeCode({ code }).subscribe({
        next: () => {
          this.loader.hide();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loader.hide();
          console.error('Erreur auth Discord :', err);
          this.router.navigate(['/']);
        },
      });
    });
  }
}
