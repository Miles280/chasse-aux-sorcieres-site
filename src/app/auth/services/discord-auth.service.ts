import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscordAuthService {
  private apiUrl = 'http://localhost:8000/api/auth/discord'; // <-- API Symfony

  private http = inject(HttpClient);

  exchangeCode(code: string): Observable<any> {
    return this.http.post(this.apiUrl, { code });
  }
}
