import { Routes } from '@angular/router';
import { DiscordLoginComponent } from './auth/discord-login/discord-login.component';
import { DiscordCallbackComponent } from './auth/discord-callback/discord-callback.component';
import { HomeNewComponent } from './home-new/home-new.component';
import { RoleComponent } from './header/role/role.component';
import { RulesComponent } from './header/rules/rules.component';
import { TeamComponent } from './header/team/team.component';
import { ManagementComponent } from './header/management/management.component';

export const routes: Routes = [
  { path: '', component: HomeNewComponent },
  { path: 'auth/discord', component: DiscordLoginComponent },
  { path: 'auth/discord/callback', component: DiscordCallbackComponent },
  { path: 'role', component: RoleComponent},
  { path: 'rules', component: RulesComponent},
  { path: 'team', component: TeamComponent},
  { path: 'management', component: ManagementComponent},
  { path: '**', redirectTo: '' },
];
