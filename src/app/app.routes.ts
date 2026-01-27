import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'regles',
    loadChildren: () =>
      import('./features/rules/rules.routes').then((m) => m.RULES_ROUTES),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('./features/roles/roles.routes').then((m) => m.ROLES_ROUTES),
  },
  {
    path: 'equipe',
    loadChildren: () =>
      import('./features/team/team.routes').then((m) => m.TEAM_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'gestion',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
