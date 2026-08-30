import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Fond animé partagé entre les pages : mêmes halos que sur la page d'accueil.
 * `position: fixed` => il ne bouge pas et ne s'étire jamais avec la hauteur
 * du contenu (tableau avec 50 lignes, formulaire long, etc.), contrairement
 * à un `bg-gradient-to-b` posé directement sur le conteneur de la page.
 *
 * Usage : le déposer une seule fois, en tout début de template de page.
 * <app-ambient-background />
 * <div class="relative z-10"> ... contenu de la page ... </div>
 */
@Component({
  selector: 'app-ambient-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ambient-background.component.html',
  styleUrl: './ambient-background.component.css',
})
export class AmbientBackgroundComponent {}
