import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class DiscordAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private env = environment;

  exchangeCode(payload: { code: string }): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/auth/discord`, payload);
  }

  private loggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  public isLoggedIn$ = this.loggedIn.asObservable();

  private roleSubject = new BehaviorSubject<string[]>(
    JSON.parse(localStorage.getItem('roles') || '[]')
  );
  public role$ = this.roleSubject.asObservable();

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
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

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token', e);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }
}
