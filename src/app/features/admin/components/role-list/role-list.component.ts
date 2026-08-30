import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from 'src/app/core/models/role.model';
import { Camp } from 'src/app/core/enums/camp.enum';
import { Alignment } from 'src/app/core/enums/alignment.enum';
import {
  getAlignmentLabel,
  getAlignmentBadgeClasses,
} from 'src/app/core/utils/alignment-display.util';
import { getCampLabel } from 'src/app/core/utils/camp-display.util';

type SortField = 'name' | 'camp' | 'minPlayer';
type SortDirection = 'asc' | 'desc';
type CampFilter = Camp | 'all';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class RoleListComponent implements OnChanges {
  @Input() roles: Role[] = [];
  @Input() isLoading = false;
  @Output() edit = new EventEmitter<Role>();
  @Output() delete = new EventEmitter<Role>();
  @Output() create = new EventEmitter<void>();

  // Exposé pour utilisation dans le template (ngClass, comparaisons)
  readonly Camp = Camp;

  private activeDropdownTrigger: HTMLElement | null = null;

  camps = Object.values(Camp);
  alignments = Object.values(Alignment);
  pageSizeOptions = [10, 25, 50];

  // --- Filtres ---
  searchTerm = '';
  campFilter: CampFilter = 'all';
  selectedAlignments: Set<Alignment> = new Set();

  // --- Dropdown du filtre alignement, ancré à l'en-tête de colonne ---
  // On le positionne en `fixed` (coordonnées calculées au clic) plutôt qu'en
  // `absolute` dans le <th>, car la carte du tableau a `overflow-hidden` :
  // un dropdown en `absolute` s'y ferait couper si le tableau est court
  // (peu de lignes). Le `fixed` échappe complètement à ce clipping.
  showAlignmentDropdown = false;
  dropdownPosition = { top: 0, left: 0 };

  // --- Tri ---
  // Convention : premier clic sur une colonne = tri croissant, peu importe la
  // colonne (texte ou numérique). Un second clic sur la MÊME colonne inverse
  // le sens. C'est le comportement standard des tableaux d'administration
  // (Material, Ant Design, etc.) : prévisible, identique sur toutes les
  // colonnes, l'utilisateur n'a qu'une seule règle à retenir.
  sortField: SortField = 'minPlayer';
  sortDirection: SortDirection = 'asc';

  // --- Pagination ---
  pageSize = 10;
  currentPage = 1;

  filteredRoles: Role[] = [];
  paginatedRoles: Role[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roles']) {
      this.applyFilters();
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
        this.applyPagination();
      }
    }
  }

  // ---------- Fermeture du dropdown alignement ----------

  /**
   * Ferme le dropdown au clic en dehors.
   * Important : on cible une classe UNIQUE (`.alignment-filter-zone`), pas
   * `.relative` — cette classe utilitaire est posée un peu partout dans
   * l'appli (barre de recherche, cards, wrapper de page...), donc
   * `closest('.relative')` matchait presque tout et le dropdown ne se
   * fermait jamais.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      this.showAlignmentDropdown &&
      !target.closest('.alignment-filter-zone')
    ) {
      this.showAlignmentDropdown = false;
      this.activeDropdownTrigger = null; // On nettoie la référence
    }
  }

  /** Referme aussi au scroll de la page, pour éviter un dropdown "fixed" qui reste affiché décalé de son bouton */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.showAlignmentDropdown) {
      // Au lieu de fermer le menu brutalement, on le laisse ouvert et on
      // met à jour ses coordonnées pour qu'il suive le tableau qui rétrécit.
      this.updateDropdownPosition();
    }
  }

  toggleAlignmentDropdown(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.showAlignmentDropdown) {
      // On sauvegarde le bouton sur lequel on vient de cliquer
      this.activeDropdownTrigger = event.currentTarget as HTMLElement;
      this.updateDropdownPosition();
    }

    this.showAlignmentDropdown = !this.showAlignmentDropdown;
  }

  // ---------- Handlers déclenchés depuis le template ----------

  private updateDropdownPosition(): void {
    if (this.activeDropdownTrigger) {
      const rect = this.activeDropdownTrigger.getBoundingClientRect();
      this.dropdownPosition = { top: rect.bottom + 8, left: rect.left };
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCampFilterChange(camp: CampFilter): void {
    this.campFilter = camp;
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleAlignmentFilter(alignment: Alignment): void {
    if (this.selectedAlignments.has(alignment)) {
      this.selectedAlignments.delete(alignment);
    } else {
      // Max 2 alignements sélectionnables en filtre
      if (this.selectedAlignments.size >= 2) {
        return;
      }
      this.selectedAlignments.add(alignment);
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  /** Un alignement non sélectionné devient non cochable une fois la limite de 2 atteinte */
  isAlignmentFilterDisabled(alignment: Alignment): boolean {
    return (
      !this.selectedAlignments.has(alignment) &&
      this.selectedAlignments.size >= 2
    );
  }

  clearAlignmentFilters(): void {
    this.selectedAlignments.clear();
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = Number(size);
    this.currentPage = 1;
    this.applyPagination();
  }

  toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.campFilter = 'all';
    this.selectedAlignments.clear();
    this.currentPage = 1;
    this.applyFilters();
  }

  // ---------- Filtrage / tri / pagination (100% côté client) ----------

  private applyFilters(): void {
    let result = [...this.roles];

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter((role) => role.name.toLowerCase().includes(term));
    }

    if (this.campFilter !== 'all') {
      result = result.filter((role) => role.camp === this.campFilter);
    }

    // Filtre alignement : recherche croisée — un rôle doit avoir TOUS les
    // alignements sélectionnés (pas juste un seul). Ex : "Support" + "Meneur"
    // sélectionnés → seuls les rôles ayant les deux à la fois s'affichent.
    if (this.selectedAlignments.size > 0) {
      result = result.filter((role) =>
        Array.from(this.selectedAlignments).every((alignment) =>
          role.alignments.includes(alignment),
        ),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (this.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'camp':
          comparison = this.getCampLabel(a.camp).localeCompare(
            this.getCampLabel(b.camp),
          );
          break;
        case 'minPlayer':
          comparison = a.minPlayer - b.minPlayer;
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredRoles = result;
    this.applyPagination();
  }

  private applyPagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedRoles = this.filteredRoles.slice(
      start,
      start + this.pageSize,
    );
  }

  // ---------- Getters utilisés dans le template pour la pagination ----------

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoles.length / this.pageSize));
  }

  get rangeStart(): number {
    return this.filteredRoles.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredRoles.length,
    );
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    while (end - start < 4 && (start > 1 || end < total)) {
      if (start > 1) start--;
      else if (end < total) end++;
      else break;
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyPagination();
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPrevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // ---------- Classes utilitaires calculées ----------

  campPillClasses(camp: CampFilter): string {
    const base =
      'px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-300';
    return camp === this.campFilter
      ? `${base} bg-violet-900/50 border-violet-500 text-white`
      : `${base} bg-transparent border-violet-500/30 text-gray-400 hover:border-violet-500/50 hover:text-gray-300`;
  }

  /** Le header de colonne est-il celui actuellement utilisé pour le tri ? */
  isSortActive(field: SortField): boolean {
    return this.sortField === field;
  }

  headerLabelClasses(field: SortField): string {
    return this.isSortActive(field)
      ? 'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 transition-colors'
      : 'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-violet-300 transition-colors';
  }

  /** Style de l'en-tête "Alignement", actif si un filtre est appliqué ou le dropdown ouvert */
  alignmentHeaderClasses(): string {
    const active =
      this.hasActiveAlignmentFilters() || this.showAlignmentDropdown;
    return active
      ? 'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 transition-colors'
      : 'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-violet-300 transition-colors';
  }

  pageButtonClasses(page: number): string {
    const base =
      'min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium border transition-all duration-300';
    return page === this.currentPage
      ? `${base} border-violet-500 bg-violet-900/50 text-white`
      : `${base} border-violet-500/30 text-gray-400 hover:border-violet-500/50 hover:text-white`;
  }

  // ---------- Alignements (couleurs/labels partagés) ----------

  alignmentLabel(alignment: Alignment): string {
    return getAlignmentLabel(alignment);
  }

  alignmentBadgeClasses(alignment: Alignment): string {
    return `px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getAlignmentBadgeClasses(alignment)}`;
  }

  isAlignmentSelected(alignment: Alignment): boolean {
    return this.selectedAlignments.has(alignment);
  }

  hasActiveAlignmentFilters(): boolean {
    return this.selectedAlignments.size > 0;
  }

  // ---------- Camps (labels partagés) ----------

  getCampLabel(camp: Camp): string {
    return getCampLabel(camp);
  }

  onEdit(role: Role): void {
    this.edit.emit(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(role: Role): void {
    this.delete.emit(role);
  }

  onCreate(): void {
    this.create.emit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
