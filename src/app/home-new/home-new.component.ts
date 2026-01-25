import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Member {
  nom: string;
  role: string;
  bg: string;
}

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-new.component.html',
  styleUrl: './home-new.component.css',
})
export class HomeNewComponent implements OnInit {
  // Liste simple, le HTML s'occupe de la doubler visuellement
  membres: Member[] = [
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
