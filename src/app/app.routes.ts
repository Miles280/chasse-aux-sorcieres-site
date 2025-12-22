import { Routes } from '@angular/router';
import { DiscordLoginComponent } from './auth/discord-login/discord-login.component';
import { DiscordCallbackComponent } from './auth/discord-callback/discord-callback.component';
import { HomeNewComponent } from './home-new/home-new.component';

export const routes: Routes = [
  { path: '', component: HomeNewComponent },
  { path: 'auth/discord', component: DiscordLoginComponent },
  { path: 'auth/discord/callback', component: DiscordCallbackComponent },
  { path: '**', redirectTo: '' },
];
