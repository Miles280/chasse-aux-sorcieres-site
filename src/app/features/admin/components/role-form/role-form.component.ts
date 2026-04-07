import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/core/models/role.model';
import { Camp } from 'src/app/core/enums/camp.enum';
import { Alignment } from 'src/app/core/enums/alignment.enum';
import { PowerFormComponent } from '../power-form/power-form.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PowerFormComponent],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css',
})
export class RoleFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() role: Role | null = null;
  @Output() save = new EventEmitter<Role>();
  @Output() cancel = new EventEmitter<void>();

  roleForm!: FormGroup;
  camps = Object.values(Camp);
  alignments = Object.values(Alignment);
  showGoalField = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.watchCampChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && this.roleForm) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Initialise le formulaire */
  private initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      minPlayer: [8, [Validators.required, Validators.min(1)]],
      camp: [Camp.VILLAGERS, Validators.required],
      goal: ['', [Validators.maxLength(255)]], // Conditionnel
      notes: [''], // Optionnel
      alignments: this.fb.array([]),
      powers: this.fb.array([]),
    });

    if (this.role) {
      this.populateForm();
    }
  }

  /** Écoute les changements du camp pour afficher/masquer le goal */
  private watchCampChanges(): void {
    this.roleForm
      .get('camp')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((camp: Camp) => {
        this.showGoalField = camp === Camp.INDEPENDENT;

        const goalControl = this.roleForm.get('goal');

        if (camp === Camp.INDEPENDENT) {
          // champ requis
          goalControl?.setValidators([Validators.required]);
        } else {
          // on enlève la validation + reset
          goalControl?.clearValidators();
          goalControl?.setValue('');
        }

        goalControl?.updateValueAndValidity();
      });
  }

  /** Remplit le formulaire avec les données du rôle */
  private populateForm(): void {
    if (!this.role) return;

    this.roleForm.patchValue({
      name: this.role.name,
      description: this.role.description,
      minPlayer: this.role.minPlayer,
      camp: this.role.camp,
      goal: this.role.goal || '',
      notes: this.role.notes || '',
    });

    // Définir showGoalField selon le camp
    this.showGoalField = this.role.camp === Camp.INDEPENDENT;

    // Alignements
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    alignmentsArray.clear();
    this.role.alignments.forEach((alignment) => {
      alignmentsArray.push(this.fb.control(alignment));
    });

    // Pouvoirs
    const powersArray = this.roleForm.get('powers') as FormArray;
    powersArray.clear();
    this.role.powers.forEach((power, index) => {
      powersArray.push(
        this.fb.group({
          id: [power.id || null],
          title: [
            power.title || '',
            [Validators.required, Validators.minLength(3)],
          ],
          description: [
            power.description || '',
            [Validators.required, Validators.minLength(5)],
          ],
          isDayPower: [power.isDayPower || false],
          isPassive: [power.isPassive || false],
          leavingHouse: [power.leavingHouse || false],
          usageLimit: [power.usageLimit || null, [Validators.min(0)]],
          position: [power.position ?? index],
        }),
      );
    });
  }

  /** Getter pour FormArray powers */
  get powersFormArray(): FormArray {
    return this.roleForm.get('powers') as FormArray;
  }

  /** Toggle alignment */
  toggleAlignment(alignment: Alignment): void {
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    const index = alignmentsArray.value.indexOf(alignment);

    // Si déjà sélectionné → on peut toujours retirer
    if (index >= 0) {
      alignmentsArray.removeAt(index);
      return;
    }

    // Sinon → bloquer si déjà 2
    if (alignmentsArray.length >= 2) {
      return;
    }

    alignmentsArray.push(this.fb.control(alignment));
  }

  /** Vérifie si un alignement est sélectionné */
  isAlignmentSelected(alignment: Alignment): boolean {
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    return alignmentsArray.value.includes(alignment);
  }

  /** Vérifie si le nombre maximum d'alignement est atteint */
  isMaxAlignmentsReached(): boolean {
    const alignmentsArray = this.roleForm.get('alignments') as FormArray;
    return alignmentsArray.length >= 2;
  }

  /** Soumet le formulaire */
  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.roleForm.value };

    // Mettre à jour les positions des pouvoirs
    formValue.powers = formValue.powers.map((power: any, index: number) => ({
      ...power,
      position: index,
    }));

    this.save.emit(formValue);
  }

  /** Annule l'édition */
  onCancel(): void {
    this.cancel.emit();
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

  get isEditMode(): boolean {
    return !!this.role;
  }
}
