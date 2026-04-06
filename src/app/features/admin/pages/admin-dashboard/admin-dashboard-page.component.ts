import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AdminCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: 'primary' | 'info' | 'success';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.css',
})
export class AdminDashboardPageComponent {
  adminCards: AdminCard[] = [
    {
      title: 'Rôles',
      description: 'Ici vous pourrez modifier les rôles',
      icon: '👤',
      route: '/gestion/roles',
      color: 'primary',
    },
    {
      title: 'Casino',
      description:
        'Ici sont modifiables : mot de passe, email, numéro de téléphone',
      icon: '🎰',
      route: '/gestion/casino',
      color: 'info',
    },
    {
      title: 'Boutique',
      description:
        'Ici sont visibles : historique de paiement, historique de versements',
      icon: '💰',
      route: '/gestion/shop',
      color: 'success',
    },
    {
      title: 'Préférences globales',
      description:
        'Ici sont modifiables : pays favori, langue (ou site), fuseau horaire',
      icon: '⚙️',
      route: '/gestion/preferences',
      color: 'primary',
    },
    {
      title: 'Compte entreprise',
      description:
        "Bénéficier des avantages d'un compte entreprise en entrant votre SIRET",
      icon: '🏢',
      route: '/gestion/company',
      color: 'info',
    },
    {
      title: 'Outils pour les hébergeurs',
      description: 'Accédez aux outils de gestion de plusieurs logements',
      icon: '🔧',
      route: '/gestion/tools',
      color: 'success',
    },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Logique de déconnexion
    console.log('Déconnexion...');
    this.router.navigate(['/auth/login']);
  }
}
