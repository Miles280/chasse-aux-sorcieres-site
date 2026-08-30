import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-power-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './power-form.component.html',
  styleUrl: './power-form.component.css',
})
export class PowerFormComponent {
  @Input() powersFormArray!: FormArray;

  // Pouvoirs actuellement dépliés. Indexé par référence de FormGroup (et non
  // par position dans le tableau) pour que l'état de dépli suive correctement
  // le bon pouvoir même après un drag & drop qui change son index.
  // Conséquence pratique : en édition, les pouvoirs existants démarrent tous
  // repliés (leurs FormGroup ne sont jamais ajoutés à ce Set) ; un pouvoir
  // fraîchement ajouté via addPower() démarre lui déplié pour le remplir direct.
  expandedPowers = new Set<FormGroup>();

  constructor(private fb: FormBuilder) {}

  /** Ajoute un nouveau pouvoir, et le déplie directement pour le remplir */
  addPower(): void {
    const position = this.powersFormArray.length;
    const group = this.createPowerFormGroup(position);
    this.powersFormArray.push(group);
    this.expandedPowers.add(group);
  }

  /** Supprime un pouvoir */
  removePower(index: number): void {
    if (confirm('Supprimer ce pouvoir ?')) {
      const group = this.powersFormArray.at(index) as FormGroup;
      this.expandedPowers.delete(group);
      this.powersFormArray.removeAt(index);
      this.updatePowerPositions();
    }
  }

  /** Gère le drag & drop des pouvoirs */
  dropPower(event: CdkDragDrop<FormGroup[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    // Récupérer le contrôle à déplacer
    const controlToMove = this.powersFormArray.at(event.previousIndex);

    // Le retirer et l'insérer à la nouvelle position
    this.powersFormArray.removeAt(event.previousIndex);
    this.powersFormArray.insert(event.currentIndex, controlToMove);

    this.updatePowerPositions();
  }

  /** Plie / déplie la carte d'un pouvoir */
  togglePowerExpanded(group: FormGroup): void {
    if (this.expandedPowers.has(group)) {
      this.expandedPowers.delete(group);
    } else {
      this.expandedPowers.add(group);
    }
  }

  isPowerExpanded(group: FormGroup): boolean {
    return this.expandedPowers.has(group);
  }

  /** Titre affiché dans l'en-tête replié, avec repli si le titre est encore vide */
  powerTitle(group: FormGroup): string {
    const title = group.get('title')?.value?.trim();
    return title || 'Pouvoir sans titre';
  }

  /** Met à jour les positions après réorganisation */
  private updatePowerPositions(): void {
    this.powersFormArray.controls.forEach((control, index) => {
      control.patchValue({ position: index });
    });
  }

  /** Crée un FormGroup pour un pouvoir */
  private createPowerFormGroup(position: number = 0): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      isDayPower: [false],
      isPassive: [false],
      leavingHouse: [false],
      usageLimit: [null, [Validators.min(0)]],
      position: [position],
    });
  }

  /** Convertit un AbstractControl en FormGroup */
  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }
}
