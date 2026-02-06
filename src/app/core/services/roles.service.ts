import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { environment } from '@env/environment';
import { HydraCollection } from '../models/hydracollection.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private env = environment;

  constructor(private http: HttpClient) {}

  /** Récupère tous les rôles en extrayant le tableau 'member' */
  getAllRoles(): Observable<Role[]> {
    return this.http
      .get<HydraCollection<Role>>(`${this.env.apiUrl}/roles`)
      .pipe(map((response) => response.member));
  }

  /** Récupère les rôles par camp */
  getRolesByCamp(camp: string): Observable<Role[]> {
    const params = new HttpParams().set('camp', camp);
    return this.http
      .get<HydraCollection<Role>>(`${this.env.apiUrl}/roles`, { params })
      .pipe(map((response) => response.member));
  }
}
