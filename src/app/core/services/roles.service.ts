import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private env = environment;

  constructor(private http: HttpClient) {}

  /** Récupère tous les rôles */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.env.apiUrl}/roles`);
  }

  /** Récupère les rôles par camp */
  getRolesByCamp(camp: string): Observable<Role[]> {
    const params = new HttpParams().set('camp', camp);
    return this.http.get<Role[]>(`${this.env.apiUrl}/roles`, { params });
  }
}
