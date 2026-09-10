import { Component } from '@angular/core';
import { WipComponent } from 'src/app/shared/components/wip/wip.component';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [WipComponent],
  templateUrl: './shop-management.component.html',
  styleUrl: './shop-management.component.css',
})
export class ShopManagementPageComponent {}
