import { Component, inject, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesPageComponent implements OnInit {
  private rolesService = inject(RolesService);

  activeTab: 'villageois' | 'sorcieres' | 'independants' = 'villageois';

  setTab(tab: 'villageois' | 'sorcieres' | 'independants') {
    this.activeTab = tab;
  }

  roles: Role[] = [];

  ngOnInit(): void {
    this.rolesService.getAllRoles().subscribe((roles) => {
      this.roles = roles;
      console.log(roles);
    });
  }
}
