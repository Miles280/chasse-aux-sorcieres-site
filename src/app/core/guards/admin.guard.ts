import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DiscordAuthService } from '../services/discord-auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(DiscordAuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getRoles()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
