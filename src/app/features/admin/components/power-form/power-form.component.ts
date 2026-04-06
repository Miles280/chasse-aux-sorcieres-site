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

  constructor(private fb: FormBuilder) {}

  /** Ajoute un nouveau pouvoir */
  addPower(): void {
    const position = this.powersFormArray.length;
    this.powersFormArray.push(this.createPowerFormGroup(position));
  }

  /** Supprime un pouvoir */
  removePower(index: number): void {
    if (confirm('Supprimer ce pouvoir ?')) {
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
