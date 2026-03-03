import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-section.component.html',
  styleUrl: './staff-section.component.css',
})
export class StaffSectionComponent {
  membres = [
    {
      nom: 'Miles 🔮',
      role: 'Administrateur',
      bg: 'bg-purple-800',
      image: 'staff/miles.gif',
    },
    {
      nom: 'Agent du Chaos',
      role: 'Développeuse',
      bg: 'bg-indigo-800',
      image: 'staff/gridlock.png',
    },
    {
      nom: 'MrGrab',
      role: 'Animateur',
      bg: 'bg-pink-800',
      image: 'staff/mrgrab.png',
    },
    {
      nom: 'Zou :)',
      role: 'Animateur',
      bg: 'bg-pink-800',
      image: 'staff/zou.gif',
    },
    {
      nom: 'MOUSTIK',
      role: 'Animateur',
      bg: 'bg-pink-800',
      image: 'staff/moustik.png',
    },
    {
      nom: 'Xeoooo_',
      role: 'Analyste',
      bg: 'bg-green-800',
      image: 'staff/xeo.png',
    },
    {
      nom: 'LouDorée',
      role: 'Graphiste',
      bg: 'bg-orange-800',
      image: 'staff/loudoree.png',
    },
  ];
}
