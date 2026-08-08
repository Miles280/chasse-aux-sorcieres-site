import { Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard/admin-dashboard-page.component';
import { roleGuard } from 'src/app/core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
    canActivate: [roleGuard(['ROLE_ADMIN'])],
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles-management/roles-management-page.component').then(
        (m) => m.RolesManagementPageComponent,
      ),
    canActivate: [roleGuard(['ROLE_ADMIN'])],
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./pages/shop-management/shop-management.component').then(
        (m) => m.ShopManagementPageComponent,
      ),
    canActivate: [roleGuard(['ROLE_ADMIN'])],
  },
];
