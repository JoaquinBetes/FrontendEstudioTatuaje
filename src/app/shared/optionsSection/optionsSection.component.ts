import { Component, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options-section',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './optionssection.component.html',
  styleUrl: './optionssection.component.scss'
})
export class OptionsSectionComponent {
  @Input() listOptions: string[] = []; // Acepta una lista de opciones
  
  constructor(private router: Router) {}

  onOptionClick(option: string) {
    if (option === 'Mis datos') {
      this.router.navigate(['/datos-usuario']);
    }
    if (option === 'Tatuadores') {
      this.router.navigate(['/encargado-tatuadores']);
    }
  }
}
