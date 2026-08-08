import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  map,
  Observable,
  Subscription,
  tap,
  shareReplay,
  timer,
} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

/**
 * Gère l'authentification via Discord OAuth :
 * - stocke le JWT applicatif (localStorage) et les rôles associés
 * - rafraîchit le JWT de façon proactive (timer, avant expiration)
 *   et réactive (via l'intercepteur HTTP / les guards, en filet de sécurité)
 * - le refresh token, lui, n'est jamais manipulé côté client :
 *   il vit dans un cookie httpOnly géré par le backend
 */
@Injectable({ providedIn: 'root' })
export class DiscordAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private env = environment;

  // --- État observable exposé au reste de l'app (navbar, guards, etc.) ---

  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  private roleSubject = new BehaviorSubject<string[]>([]);
  public role$ = this.roleSubject.asObservable();

  // --- Configuration ---

  /** Marge de sécurité : un token est considéré invalide s'il expire dans moins de X secondes. */
  private readonly VALIDITY_BUFFER_SECONDS = 60;

  /** Le timer proactif se déclenche X secondes avant l'expiration réelle du JWT. */
  private readonly REFRESH_MARGIN_SECONDS = 90;

  // --- État interne ---

  /** Référence partagée vers un refresh en cours, pour ne jamais en déclencher deux en parallèle. */
  private refreshInProgress$: Observable<string> | null = null;

  /** Abonnement au timer de refresh proactif, pour pouvoir l'annuler/le reprogrammer. */
  private refreshTimerSub: Subscription | null = null;

  constructor() {
    this.initializeAuth();

    // Synchronise l'état entre plusieurs onglets ouverts sur le même site :
    // si un onglet rafraîchit le token, les autres se mettent à jour sans
    // déclencher leur propre appel réseau.
    window.addEventListener('storage', (event) => this.onStorageChange(event));
  }

  // ============================================================
  // Initialisation
  // ============================================================

  /**
   * Appelé au démarrage de l'app. Trois cas possibles :
   * - pas de token → utilisateur non connecté, rien à faire
   * - token encore valide → on restaure l'état directement
   * - token expiré → on tente un refresh silencieux avant de conclure
   */
  private initializeAuth(): void {
    const token = this.getToken();

    if (token && this.isTokenValid(token)) {
      this.restoreAuthState(token);
    } else if (token) {
      this.refreshToken().subscribe({
        error: () => this.clearAuthState(),
      });
    }
  }

  /** Restaure loggedIn$/role$ à partir d'un token déjà valide, et programme son renouvellement. */
  private restoreAuthState(token: string): void {
    this.loggedIn.next(true);

    const decoded = this.decodeToken(token);
    if (decoded?.roles) {
      this.roleSubject.next(decoded.roles);
    }

    this.scheduleTokenRefresh(token);
  }

  private onStorageChange(event: StorageEvent): void {
    if (event.key !== 'token') return;

    if (event.newValue && this.isTokenValid(event.newValue)) {
      // Un autre onglet a rafraîchi le token : on récupère son état sans refaire d'appel réseau.
      this.restoreAuthState(event.newValue);
    } else if (!event.newValue) {
      // Un autre onglet s'est déconnecté.
      this.loggedIn.next(false);
      this.roleSubject.next([]);
      this.refreshTimerSub?.unsubscribe();
    }
  }

  // ============================================================
  // Refresh proactif
  // ============================================================

  /**
   * Programme le prochain refresh automatique, un peu avant l'expiration réelle du JWT,
   * de façon à ce que l'utilisateur ne voie quasiment jamais son token expirer
   * tant que l'onglet reste ouvert.
   */
  private scheduleTokenRefresh(token: string): void {
    this.refreshTimerSub?.unsubscribe();

    const payload = this.decodeToken(token);
    if (!payload?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const delayMs =
      Math.max(payload.exp - now - this.REFRESH_MARGIN_SECONDS, 0) * 1000;

    this.refreshTimerSub = timer(delayMs).subscribe(() => {
      this.refreshToken().subscribe({
        error: () => this.clearAuthState(),
      });
    });
  }

  // ============================================================
  // Actions d'authentification
  // ============================================================

  /** Échange le code OAuth Discord contre un JWT applicatif (login). */
  exchangeCode(payload: { code: string }): Observable<any> {
    return this.http
      .post(`${this.env.apiUrl}/auth/login`, payload, { withCredentials: true })
      .pipe(tap((response: any) => this.saveToken(response.token)));
  }

  logout(): void {
    this.http
      .post(`${this.env.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.finalizeLogout(),
        error: () => this.finalizeLogout(), // on nettoie même si l'appel serveur échoue
      });
  }

  private finalizeLogout(): void {
    this.clearAuthState();
    this.router.navigate(['']);
  }

  /**
   * Rafraîchit le JWT via le cookie httpOnly de refresh.
   * Si un refresh est déjà en cours, on renvoie ce même Observable
   * plutôt que d'en déclencher un second en parallèle.
   */
  refreshToken(): Observable<string> {
    if (this.refreshInProgress$) {
      return this.refreshInProgress$;
    }

    this.refreshInProgress$ = this.http
      .post<{
        token: string;
      }>(`${this.env.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        // Placé avant shareReplay : se déclenche une seule fois, quel que soit
        // le nombre d'abonnés concurrents (intercepteur + guards par ex.).
        tap({ finalize: () => (this.refreshInProgress$ = null) }),
        map((response) => {
          this.saveToken(response.token);
          return response.token;
        }),
        shareReplay(1),
      );

    return this.refreshInProgress$;
  }

  // ============================================================
  // Stockage local du token
  // ============================================================

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);

    const decoded = this.decodeToken(token);
    if (decoded?.roles) {
      const roles: string[] = decoded.roles;
      localStorage.setItem('roles', JSON.stringify(roles));
      this.roleSubject.next(roles);
    }

    this.scheduleTokenRefresh(token);
  }

  /** Nettoie toute trace de session locale (token, rôles, état observable, timer). */
  private clearAuthState(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.loggedIn.next(false);
    this.roleSubject.next([]);
    this.refreshTimerSub?.unsubscribe();
    this.refreshTimerSub = null;
  }

  /** Version publique, pour que les guards puissent nettoyer l'état sans repasser par /auth/logout. */
  public clearSession(): void {
    this.clearAuthState();
  }

  // ============================================================
  // Utilitaires
  // ============================================================

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token', e);
      return null;
    }
  }

  private isTokenValid(
    token: string,
    bufferSeconds: number = this.VALIDITY_BUFFER_SECONDS,
  ): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now + bufferSeconds;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  isStaff(): boolean {
    return this.getRoles().includes('MJ');
  }
}
