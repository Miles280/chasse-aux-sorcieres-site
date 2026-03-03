import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { DiscordAuthService } from '../services/discord-auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(DiscordAuthService);
  const token = authService.getToken();

  // 1. Cloner la requête pour ajouter le Header Authorization si on a un token
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  // 2. Passer la main, mais écouter les erreurs
  return next(authReq).pipe(
    catchError((error) => {
      // Si l'erreur est une 401 (Unauthorized) ET que la requête n'était pas déjà un refresh
      // (On évite une boucle infinie si le refresh lui-même plante)
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !authReq.url.includes('/auth/refresh') &&
        !authReq.url.includes('/auth/login')
      ) {
        return handle401Error(authReq, next, authService);
      }

      // Sinon, on laisse passer l'erreur telle quelle
      return throwError(() => error);
    }),
  );
};

// Fonction helper pour gérer le refresh et le rejeu de la requête
const handle401Error = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: DiscordAuthService,
): Observable<HttpEvent<unknown>> => {
  return authService.refreshToken().pipe(
    switchMap((newToken) => {
      // A. Le refresh a fonctionné !
      // On rejoue la requête initiale avec le nouveau token
      const retryReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` },
      });
      return next(retryReq);
    }),
    catchError((refreshError) => {
      // B. Le refresh a échoué (Cookie expiré ou invalide)
      // On déconnecte proprement l'utilisateur
      authService.logout();
      return throwError(() => refreshError);
    }),
  );
};
