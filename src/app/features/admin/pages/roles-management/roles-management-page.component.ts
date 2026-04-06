import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { RoleFormComponent } from '../../components/role-form/role-form.component';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [CommonModule, RoleListComponent, RoleFormComponent],
  templateUrl: './roles-management-page.component.html',
  styleUrl: './roles-management-page.component.css',
})
export class RolesManagementPageComponent implements OnInit {
  viewMode: ViewMode = 'list';
  roles: Role[] = [];
  selectedRole: Role | null = null;
  isLoading = false;

  constructor(
    private rolesService: RolesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  /** Charge tous les rôles */
  loadRoles(): void {
    this.isLoading = true;
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement des rôles:', err);
        this.isLoading = false;
      },
    });
  }

  /** Bascule vers la vue liste */
  showList(): void {
    this.viewMode = 'list';
    this.selectedRole = null;
  }

  /** Affiche le formulaire de création */
  handleCreate(): void {
    this.selectedRole = null;
    this.viewMode = 'form';
  }

  /** Affiche le formulaire d'édition */
  handleEdit(role: Role): void {
    this.selectedRole = role;
    this.viewMode = 'form';
  }

  /** Sauvegarde un rôle (création ou modification) */
  handleSave(role: Role): void {
    if (this.selectedRole?.id) {
      // Mise à jour
      this.rolesService.updateRole(this.selectedRole.id, role).subscribe({
        next: () => {
          console.log('Rôle mis à jour');
          this.loadRoles();
          this.showList();
        },
        error: (err) => console.error('Erreur mise à jour:', err),
      });
    } else {
      // Création
      this.rolesService.createRole(role).subscribe({
        next: () => {
          console.log('Rôle créé');
          this.loadRoles();
          this.showList();
        },
        error: (err) => console.error('Erreur création:', err),
      });
    }
  }

  /** Supprime un rôle */
  handleDelete(role: Role): void {
    if (!role.id) return;

    if (confirm(`Supprimer le rôle "${role.name}" ?`)) {
      this.rolesService.deleteRole(role.id).subscribe({
        next: () => {
          console.log('Rôle supprimé');
          this.loadRoles();
        },
        error: (err) => console.error('Erreur suppression:', err),
      });
    }
  }

  /** Retourne à l'admin dashboard */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
