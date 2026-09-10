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
      description: 'Gérez les rôles et leurs pouvoirs pour les parties.',
      icon: '👤',
      route: '/gestion/roles',
      color: 'primary',
    },
    {
      title: 'Casino',
      description:
        'Gérez le casino et les fonctionnalités associées du serveur.',
      icon: '🎰',
      route: '/gestion/casino',
      color: 'info',
    },
    {
      title: 'Boutique',
      description: 'Gérez la boutique, les objets et l’économie.',
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
