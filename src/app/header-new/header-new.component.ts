import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-new.component.html',
  styleUrl: './header-new.component.css'
})
export class HeaderNewComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}