import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DiscordAuthService } from '../services/discord-auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(DiscordAuthService);
  const router = inject(Router);

  // 1. Si le token est valide et qu'il a le bon rôle, on passe direct
  if (
    authService.isLoggedIn() &&
    authService.getRoles().includes('ROLE_ADMIN')
  ) {
    return true;
  }

  // 2. Si le token est expiré (ou absent), on tente un refresh au lieu de le bloquer direct
  return authService.refreshToken().pipe(
    map(() => {
      console.log('Rôles après refresh :', authService.getRoles());
      // Le refresh a marché ! On vérifie s'il a bien le rôle Admin avec le nouveau token
      if (authService.getRoles().includes('ROLE_ADMIN')) {
        return true; // C'est bon, on le laisse entrer
      } else {
        router.navigate(['/']); // Pas admin, on le vire
        return false;
      }
    }),
    catchError(() => {
      // Le refresh a échoué (cookie expiré aussi), on le ramène à l'accueil
      router.navigate(['/']);
      return of(false);
    }),
  );
};
