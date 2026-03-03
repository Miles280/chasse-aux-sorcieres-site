import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roles-preview-section',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './roles-preview-section.component.html',
  styleUrl: './roles-preview-section.component.css',
})
export class RolesPreviewSectionComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target); // animation une seule fois
        }
      });
    }, {
      threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));
  }
}
