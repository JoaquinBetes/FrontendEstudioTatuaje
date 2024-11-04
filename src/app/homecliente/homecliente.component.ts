import { Component } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component.js';

@Component({
  selector: 'app-homecliente',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent
  ],
  templateUrl: './homecliente.component.html',
  styleUrl: './homecliente.component.scss'
})
export class HomeClienteComponent {
  listOptions = ["Mis turnos", "Diseños", "Buscar diseños", "Mis datos"];
}

