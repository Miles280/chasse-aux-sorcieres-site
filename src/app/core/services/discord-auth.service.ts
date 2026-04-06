import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscordAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private env = environment;

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.loggedIn.asObservable();

  private roleSubject = new BehaviorSubject<string[]>(
    JSON.parse(localStorage.getItem('roles') || '[]'),
  );
  public role$ = this.roleSubject.asObservable();

  /**
   * LOGIN
   * Le serveur va renvoyer le token (body) et mettre le refreshToken (cookie)
   */
  exchangeCode(payload: { code: string }): Observable<any> {
    return this.http
      .post(`${this.env.apiUrl}/auth/login`, payload, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          // On ne reçoit plus le refreshToken ici, c'est normal !
          this.saveToken(response.token);

          // Optionnel : si ton backend renvoie déjà les rôles dans 'user',
          // tu peux les set ici directement sans décoder le token.
        }),
      );
  }

  /**
   * LOGOUT
   * On doit appeler le serveur pour qu'il supprime le cookie HttpOnly
   */
  logout(): void {
    // 1. Appel au serveur pour tuer le cookie
    this.http
      .post(
        `${this.env.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => this.finalizeLogout(),
        error: () => this.finalizeLogout(), // On logout même si l'API plante
      });
  }

  private finalizeLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.loggedIn.next(false);
    this.roleSubject.next([]);
    this.router.navigate(['']);
  }

  /**
   * REFRESH TOKEN
   * On n'envoie RIEN dans le body. Le navigateur envoie le cookie tout seul.
   */
  refreshToken(): Observable<string> {
    return this.http
      .post<{ token: string }>(
        `${this.env.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true, // IMPORTANT : Pour envoyer le cookie au serveur
        },
      )
      .pipe(
        map((response) => {
          this.saveToken(response.token);
          // Le nouveau refreshToken est mis à jour automatiquement par le serveur via Set-Cookie
          return response.token;
        }),
      );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);

    const decoded = this.decodeToken(token);

    if (decoded?.roles) {
      const roles: string[] = decoded.roles;
      localStorage.setItem('roles', JSON.stringify(roles));
      this.roleSubject.next(roles);
    }
  }

  // --- Méthodes utilitaires ---

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token', e);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  isStaff(): boolean {
    return this.getRoles().includes('MJ');
  }

  checkAuthStatus(): void {
    if (!this.isLoggedIn()) {
      this.refreshToken().subscribe({
        next: () => console.log('Reconnexion automatique réussie'),
        error: () => {
          this.finalizeLogout();
        },
      });
    }
  }
}
