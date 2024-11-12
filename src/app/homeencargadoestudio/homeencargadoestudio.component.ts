import { Component } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component';


@Component({
  selector: 'app-homeencargadoestudio',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent,
  ],
  templateUrl: './homeencargadoestudio.component.html',
  styleUrl: './homeencargadoestudio.component.scss'
})
export class HomeEncargadoEstudioComponent {
  listOptions = ["Tatuadores", "Sucursal", "Políticas", "Liquidaciones de Sueldo", "Informes"];
  ngOnInit(): void {
    sessionStorage.setItem('encargado', 'true');
    sessionStorage.removeItem('sucursal')
    sessionStorage.removeItem('politicas')
  }
}
