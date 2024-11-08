import { Component } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { TattooSection } from '../shared/tattooSection/tattooSection.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderTattoo,
    TattooSection,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  ngOnInit(): void {
    // Elimina el valor de 'encargado' del sessionStorage cuando se carga el componente
    sessionStorage.removeItem('encargado');
  }
}
