import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  activeTab: 'villageois' | 'sorcieres' | 'independants' = 'villageois';

  setTab(tab: 'villageois' | 'sorcieres' | 'independants') {
    this.activeTab = tab;
  }
}

