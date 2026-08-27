import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { WipComponent } from 'src/app/shared/components/wip/wip.component';
import { AmbientBackgroundComponent } from 'src/app/shared/components/ambient-background/ambient-background.component';
import { Camp } from 'src/app/core/enums/camp.enum';
import { Alignment } from 'src/app/core/enums/alignment.enum';
import {
  getAlignmentLabel,
  getAlignmentBadgeClasses,
} from 'src/app/core/utils/alignment-display.util';
import { getCampLabel } from 'src/app/core/utils/camp-display.util';
import { environment } from '@env/environment';

type CampTab = 'villagers' | 'witch' | 'independent';
type SortOption = 'name-asc' | 'name-desc' | 'players-asc' | 'players-desc';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WipComponent,
    AmbientBackgroundComponent,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.css',
})
export class RolesPageComponent implements OnInit {
  private rolesService = inject(RolesService);

  baseUrl = environment.serverUrl;

  activeTab: CampTab = 'villagers';
  searchTerm = '';
  sortOption: SortOption = 'name-asc';

  roles: Role[] = [];
  filteredRoles: Role[] = [];
  paginatedRoles: Role[] = [];

  selectedRole: Role | null = null;

  pageSize = 6;
  currentPage = 1;

  private mockRoles: Role[] = [
    {
      id: 1,
      name: 'Simple VILLAGERS',
      description:
        "N'a aucun pouvoir particulier, mais une grande force de conviction.",
      minPlayer: 6,
      camp: Camp.VILLAGERS,
      powers: [],
      alignments: [],
    },
    {
      id: 2,
      name: 'Voyante',
      description: "Peut découvrir le rôle d'un joueur chaque nuit.",
      minPlayer: 6,
      camp: Camp.VILLAGERS,
      powers: [],
      alignments: [],
    },
    {
      id: 3,
      name: 'Sorcière Rouge',
      description:
        "Possède deux potions : une pour donner la vie, l'autre la mort.",
      minPlayer: 8,
      camp: Camp.WITCH,
      powers: [],
      alignments: [],
    },
    {
      id: 4,
      name: 'Liche',
      description: 'Cherche à corrompre les vivants pour son propre compte.',
      minPlayer: 10,
      camp: Camp.INDEPENDENT,
      powers: [],
      alignments: [],
    },
    {
      id: 5,
      name: 'Chasseur',
      description: "S'il meurt, il emporte quelqu'un avec lui dans la tombe.",
      minPlayer: 6,
      camp: Camp.VILLAGERS,
      powers: [],
      alignments: [],
    },
    {
      id: 6,
      name: 'Apprentie Sorcière',
      description: 'Apprend les secrets des potions auprès de ses pairs.',
      minPlayer: 8,
      camp: Camp.WITCH,
      powers: [],
      alignments: [],
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

  setTab(tab: CampTab): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.filterRoles();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.filterRoles();
  }

  onSortChange(): void {
    this.filterRoles();
  }

  tabCount(tab: CampTab): number {
    return this.roles.filter((role) => role.camp === tab).length;
  }

  filterRoles(): void {
    let result = this.roles.filter((role) => role.camp === this.activeTab);

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (role) =>
          role.name.toLowerCase().includes(term) ||
          role.description.toLowerCase().includes(term),
      );
    }

    result = [...result].sort((a, b) => {
      switch (this.sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'players-asc':
          return a.minPlayer - b.minPlayer;
        case 'players-desc':
          return b.minPlayer - a.minPlayer;
      }
    });

    this.filteredRoles = result;
    this.applyPagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.filterRoles();
  }

  private applyPagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedRoles = this.filteredRoles.slice(
      start,
      start + this.pageSize,
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoles.length / this.pageSize));
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

  pageButtonClasses(page: number): string {
    const base =
      'min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-medium border transition-all duration-300';
    return page === this.currentPage
      ? `${base} border-violet-500 bg-violet-900/50 text-white`
      : `${base} border-violet-500/30 text-gray-400 hover:border-violet-500/50 hover:text-white`;
  }

  // Exposé pour utilisation dans le template (ngClass, comparaisons)
  readonly Camp = Camp;

  getCampLabel(camp: Camp): string {
    return getCampLabel(camp);
  }

  // --- Alignements (mêmes couleurs/labels que le tableau admin) ---

  alignmentLabel(alignment: Alignment): string {
    return getAlignmentLabel(alignment);
  }

  alignmentBadgeClasses(alignment: Alignment): string {
    return `px-3 py-1 rounded-full text-xs font-medium ${getAlignmentBadgeClasses(alignment)}`;
  }

  // --- Modale de détail ---

  openModal(role: Role): void {
    this.selectedRole = role;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedRole = null;
    document.body.style.overflow = 'auto';
  }
}
