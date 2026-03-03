import { Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { adminGuard } from 'src/app/core/guards/admin.guard';
import { authGuard } from 'src/app/core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles-management/roles-management.component').then(
        (m) => m.RolesManagementPageComponent,
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./pages/shop-management/shop-management.component').then(
        (m) => m.ShopManagementPageComponent,
      ),
    canActivate: [authGuard, adminGuard],
  },
];
