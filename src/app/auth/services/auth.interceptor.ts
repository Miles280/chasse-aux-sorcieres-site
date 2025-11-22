import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

import { inject } from '@angular/core';
import { DiscordAuthService } from './discord-auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(DiscordAuthService);

  const token = authService.getToken();
  if (token && authService.isTokenExpired()) {
    // Appel à l'API pour refresh
    return authService.refreshToken().pipe(
      switchMap((newToken) => {
        if (!newToken) {
          authService.logout();
          throw new Error('JWT refresh failed');
        }
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(authReq);
      })
    );
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
