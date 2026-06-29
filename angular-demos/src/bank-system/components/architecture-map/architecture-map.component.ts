import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bank-architecture-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './architecture-map.component.html',
  styleUrl: './architecture-map.component.css',
})
export class ArchitectureMapComponent {}
