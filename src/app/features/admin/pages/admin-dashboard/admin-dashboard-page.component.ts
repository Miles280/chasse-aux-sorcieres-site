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
      title: 'À venir...',
      description: 'Revenez plus tard !',
      icon: '⚙️',
      route: '/gestion',
      color: 'primary',
    },
    {
      title: 'À venir...',
      description: 'Revenez plus tard !',
      icon: '🏢',
      route: '/gestion',
      color: 'info',
    },
    {
      title: 'À venir...',
      description: 'Revenez plus tard !',
      icon: '🔧',
      route: '/gestion',
      color: 'success',
    },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
