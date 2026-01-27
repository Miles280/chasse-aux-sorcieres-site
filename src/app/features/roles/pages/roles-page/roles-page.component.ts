import { Component } from '@angular/core';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesPageComponent {
  activeTab: 'villageois' | 'sorcieres' | 'independants' = 'villageois';

  setTab(tab: 'villageois' | 'sorcieres' | 'independants') {
    this.activeTab = tab;
  }
}
