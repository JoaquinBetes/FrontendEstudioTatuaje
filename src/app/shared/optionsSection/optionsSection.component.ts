import { Component, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-options-section',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './optionssection.component.html',
  styleUrl: './optionssection.component.scss'
})
export class OptionsSectionComponent {
  @Input() listOptions: string[] = []; // Acepta una lista de opciones
}
