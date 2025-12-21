import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiscordLoginComponent } from './auth/discord-login/discord-login.component';
import { DiscordCallbackComponent } from './auth/discord-callback/discord-callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/discord', component: DiscordLoginComponent },
  { path: 'auth/discord/callback', component: DiscordCallbackComponent },
  { path: '**', redirectTo: '' },
];
