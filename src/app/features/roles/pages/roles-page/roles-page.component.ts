import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role, Camp } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { WipComponent } from 'src/app/shared/components/wip/wip.component';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, WipComponent],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesPageComponent implements OnInit {
  private rolesService = inject(RolesService);

  activeTab: 'villageois' | 'sorcieres' | 'independants' = 'villageois';

  roles: Role[] = [];
  filteredRoles: Role[] = [];

  // --- NOUVELLE VARIABLE POUR LA MODALE ---
  selectedRole: Role | null = null; 

  private mockRoles: Role[] = [
    { 
      id: 1, 
      name: 'Simple Villageois', 
      description: 'N\'a aucun pouvoir particulier, mais une grande force de conviction.', 
      minPlayer: 6, 
      camp: Camp.VILLAGEOIS,
      powers: [],
      alignment: []
    },
    { 
      id: 2, 
      name: 'Voyante', 
      description: 'Peut découvrir le rôle d\'un joueur chaque nuit.', 
      minPlayer: 6, 
      camp: Camp.VILLAGEOIS,
      powers: [],
      alignment: []
    },
    { 
      id: 3, 
      name: 'Sorcière Rouge', 
      description: 'Possède deux potions : une pour donner la vie, l\'autre la mort.', 
      minPlayer: 8, 
      camp: Camp.SORCIERES,
      powers: [],
      alignment: []
    },
    { 
      id: 4, 
      name: 'Liche', 
      description: 'Cherche à corrompre les vivants pour son propre compte.', 
      minPlayer: 10, 
      camp: Camp.INDEPENDANTS,
      powers: [],
      alignment: []
    },
    { 
      id: 5, 
      name: 'Chasseur', 
      description: 'S\'il meurt, il emporte quelqu\'un avec lui dans la tombe.', 
      minPlayer: 6, 
      camp: Camp.VILLAGEOIS,
      powers: [],
      alignment: []
    },
    { 
      id: 6, 
      name: 'Apprentie Sorcière', 
      description: 'Apprend les secrets des potions auprès de ses pairs.', 
      minPlayer: 8, 
      camp: Camp.SORCIERES,
      powers: [],
      alignment: []
    },
  ];

  ngOnInit(): void {
    // Une fois ton CORS réglé, tu pourras décommenter l'appel au service :
    // this.rolesService.getAllRoles().subscribe((roles) => {
    //   this.roles = roles;
    //   this.filterRoles();
    // });

    this.roles = this.mockRoles;
    this.filterRoles();
  }

  setTab(tab: 'villageois' | 'sorcieres' | 'independants') {
    this.activeTab = tab;
    this.filterRoles();
  }

  filterRoles() {
    const map: Record<string, Camp> = {
      villageois: Camp.VILLAGEOIS,
      sorcieres: Camp.SORCIERES,
      independants: Camp.INDEPENDANTS,
    };

    const targetCamp = map[this.activeTab];
    this.filteredRoles = this.roles.filter((role) => role.camp === targetCamp);
  }

  // --- MÉTHODES DE LA MODALE ---
  openModal(role: Role) {
    this.selectedRole = role;
    document.body.style.overflow = 'hidden'; // Bloque le scroll
  }

  closeModal() {
    this.selectedRole = null;
    document.body.style.overflow = 'auto'; // Libère le scroll
  }
}