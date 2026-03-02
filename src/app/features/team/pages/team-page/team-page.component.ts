import { Component } from '@angular/core';
import { WipComponent } from 'src/app/shared/components/wip/wip.component';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [WipComponent],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.css'
})
export class TeamPageComponent {

}
