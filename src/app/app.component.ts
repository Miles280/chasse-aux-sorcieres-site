import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./old/header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderNewComponent } from "./header-new/header-new.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderNewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chasse-aux-sorcieres-site';
}
