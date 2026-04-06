import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { Camp } from 'src/app/core/enums/camp.enum';
import { Alignment } from 'src/app/core/enums/alignment.enum';

type ViewMode = 'list' | 'form';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-management-page.component.html',
  styleUrl: './roles-management-page.component.css',
})
export class RolesManagementPageComponent implements OnInit {
  viewMode: ViewMode = 'list';
  roles: Role[] = [];
  roleForm!: FormGroup;
  isEditMode = false;
  editingRoleId: number | null = null;
  isLoading = false;

  // Enums pour les templates
  camps = Object.values(Camp);
  alignments = Object.values(Alignment);

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  /** Initialise le formulaire */
  private initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      minPlayer: [4, [Validators.required, Validators.min(1)]],
      camp: [Camp.VILLAGERS, Validators.required],
      goal: [null],
      alignments: this.fb.array([]),
      powers: this.fb.array([]),
    });
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

  /** Bascule entre liste et formulaire */
  switchView(mode: ViewMode): void {
    this.viewMode = mode;
    if (mode === 'list') {
      this.resetForm();
    }
  }

  /** Affiche le formulaire en mode création */
  showCreateForm(): void {
    this.isEditMode = false;
    this.editingRoleId = null;
    this.resetForm();
    this.viewMode = 'form';
  }

  /** Affiche le formulaire en mode édition */
  editRole(role: Role): void {
    this.isEditMode = true;
    this.editingRoleId = role.id!;
    this.viewMode = 'form';

    // Remplir le formulaire avec les données du rôle
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      minPlayer: role.minPlayer,
      camp: role.camp,
      goal: role.goal,
    });

    // Gérer les alignements
    this.setAlignments(role.alignments);

    // TODO: Gérer les powers
  }

  /** Définit les alignements dans le formulaire */
  private setAlignments(alignments: Alignment[]): void {
    const alignmentsFormArray = this.roleForm.get('alignments') as FormArray;
    alignmentsFormArray.clear();
    alignments.forEach((alignment) => {
      alignmentsFormArray.push(this.fb.control(alignment));
    });
  }

  /** Soumet le formulaire */
  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formValue = this.roleForm.value;

    if (this.isEditMode && this.editingRoleId) {
      // Mise à jour
      this.rolesService.updateRole(this.editingRoleId, formValue).subscribe({
        next: () => {
          console.log('Rôle mis à jour');
          this.loadRoles();
          this.switchView('list');
        },
        error: (err) => console.error('Erreur mise à jour:', err),
      });
    } else {
      // Création
      this.rolesService.createRole(formValue).subscribe({
        next: () => {
          console.log('Rôle créé');
          this.loadRoles();
          this.switchView('list');
        },
        error: (err) => console.error('Erreur création:', err),
      });
    }
  }

  /** Supprime un rôle */
  deleteRole(role: Role): void {
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

  /** Réinitialise le formulaire */
  resetForm(): void {
    this.roleForm.reset({
      camp: Camp.VILLAGERS,
      minPlayer: 4,
    });
    (this.roleForm.get('alignments') as FormArray).clear();
    (this.roleForm.get('powers') as FormArray).clear();
    this.isEditMode = false;
    this.editingRoleId = null;
  }

  /** Gère le toggle des alignements */
  toggleAlignment(alignment: Alignment): void {
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    const index = alignmentsArray.value.indexOf(alignment);

    if (index >= 0) {
      alignmentsArray.removeAt(index);
    } else {
      alignmentsArray.push(this.fb.control(alignment));
    }
  }

  /** Vérifie si un alignement est sélectionné */
  isAlignmentSelected(alignment: Alignment): boolean {
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    return alignmentsArray.value.includes(alignment);
  }

  /** Retourne à l'admin dashboard */
  goBack(): void {
    this.router.navigate(['/admin']);
  }

  /** Getter pour le label du camp */
  getCampLabel(camp: Camp): string {
    const labels = {
      [Camp.VILLAGERS]: 'Villageois',
      [Camp.WITCH]: 'Sorcières',
      [Camp.INDEPENDENT]: 'Indépendants',
    };
    return labels[camp];
  }

  /** Getter pour le label de l'alignement */
  getAlignmentLabel(alignment: Alignment): string {
    const labels = {
      [Alignment.KILLER]: 'Tueur',
      [Alignment.INFORMER]: 'Informateur',
      [Alignment.LEADER]: 'Meneur',
      [Alignment.PROTECTOR]: 'Protecteur',
      [Alignment.SUPPORT]: 'Support',
    };
    return labels[alignment];
  }

  /** Getter pour la couleur de l'alignement */
  getAlignmentColor(alignment: Alignment): string {
    const colors = {
      [Alignment.SUPPORT]: 'info',
      [Alignment.LEADER]: 'warning',
      [Alignment.KILLER]: 'danger',
      [Alignment.INFORMER]: 'info',
      [Alignment.PROTECTOR]: 'info',
    };
    return colors[alignment];
  }
}
