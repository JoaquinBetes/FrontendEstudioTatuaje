import { Component } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component.js';

@Component({
  selector: 'app-hometatuador',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent
  ],
  templateUrl: './hometatuador.component.html',
  styleUrl: './hometatuador.component.scss'
})
export class HomeTatuadorComponent {
  listOptions = ["Mis turnos", "Mis Diseños", "Mis datos", "Sueldo"];
}