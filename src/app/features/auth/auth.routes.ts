import { Routes } from '@angular/router';
import { AuthCallbackPageComponent } from './pages/auth-callback/auth-callback.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthCallbackPageComponent,
  },
];
