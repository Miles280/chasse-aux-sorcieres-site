import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DiscordAuthService } from '../services/discord-auth.service';
import { catchError, map, of } from 'rxjs';

export function roleGuard(requiredRoles: string[] = []): CanActivateFn {
  return () => {
    const authService = inject(DiscordAuthService);
    const router = inject(Router);

    const hasAccess = () =>
      requiredRoles.length === 0 ||
      requiredRoles.some((role) => authService.getRoles().includes(role));

    if (authService.isLoggedIn() && hasAccess()) {
      return true;
    }

    // Token absent, expiré, ou rôles pas à jour : on tente un refresh
    // silencieux AVANT de conclure que l'accès doit être refusé
    return authService.refreshToken().pipe(
      map(() => {
        if (hasAccess()) return true;
        router.navigate(['/']);
        return false;
      }),
      catchError(() => {
        authService.clearSession();
        router.navigate(['/']);
        return of(false);
      }),
    );
  };
}
