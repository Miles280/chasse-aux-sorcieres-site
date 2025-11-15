import { Component, AfterViewInit, OnInit } from '@angular/core';

interface Member {
  nom: string;
  role: string;
  bg: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

  membres: Member[] = [
    { nom: 'Miles', role: 'Animateur', bg: 'bg-purple-800' },
    { nom: 'Zou :)', role: 'Animateur', bg: 'bg-indigo-800' },
    { nom: 'Protecteur', role: 'Défenseur', bg: 'bg-green-800' },
    { nom: 'Espion', role: 'Observateur', bg: 'bg-pink-800' },
  ];

  memberDuplicated: Member[] = [];

  ngOnInit(): void {
    this.memberDuplicated = [...this.membres, ...this.membres];
  }

  ngAfterViewInit(): void {
    const revealElements = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");

    const revealOnScroll = () => {
      const windowWidth = window.innerWidth;
      
      revealElements.forEach(el => {
        const elementLeft = el.getBoundingClientRect().left;
        
        if (elementLeft < windowWidth - 100) {
          el.classList.remove("opacity-0", "-translate-x-20");
          el.classList.add("opacity-100", "translate-x-0");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("resize", revealOnScroll);
    revealOnScroll(); 
  }
}