import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
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