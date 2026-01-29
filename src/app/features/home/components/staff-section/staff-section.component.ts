import { Component } from '@angular/core';

@Component({
  selector: 'app-staff-section',
  standalone: true,
  imports: [],
  templateUrl: './staff-section.component.html',
  styleUrl: './staff-section.component.css',
})
export class StaffSectionComponent {
  membres = [
    { nom: 'Miles 🔮', role: 'Administrateur', bg: 'bg-purple-800' },
    { nom: 'Agent du Chaos', role: 'Développeuse', bg: 'bg-indigo-800' },
    { nom: 'MrGrab', role: 'Animateur', bg: 'bg-pink-800' },
    { nom: 'Zou :)', role: 'Animateur', bg: 'bg-pink-800' },
    { nom: 'MOUSTIK', role: 'Animateur', bg: 'bg-pink-800' },
    { nom: 'Xeoooo_', role: 'Analyste', bg: 'bg-green-800' },
    { nom: 'LouDorée', role: 'Graphiste', bg: 'bg-orange-800' },
  ];

  ngOnInit(): void {}
}
