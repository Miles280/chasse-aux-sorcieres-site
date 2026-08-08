import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Role } from 'src/app/core/models/role.model';
import { Camp } from 'src/app/core/enums/camp.enum';
import { Alignment } from 'src/app/core/enums/alignment.enum';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class RoleListComponent {
  @Input() roles: Role[] = [];
  @Input() isLoading = false;
  @Output() edit = new EventEmitter<Role>();
  @Output() delete = new EventEmitter<Role>();
  @Output() create = new EventEmitter<void>();

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

  onEdit(role: Role): void {
    this.edit.emit(role);
  }

  onDelete(role: Role): void {
    this.delete.emit(role);
  }

  onCreate(): void {
    this.create.emit();
  }
}
