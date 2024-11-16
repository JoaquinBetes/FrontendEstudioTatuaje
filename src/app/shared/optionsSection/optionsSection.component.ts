import { Component, inject, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ventanaDialogInforme } from '../ventana/ventana.component.js';

@Component({
  selector: 'app-options-section',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './optionssection.component.html',
  styleUrl: './optionssection.component.scss'
})
export class OptionsSectionComponent {
  @Input() listOptions: string[] = []; // Acepta una lista de opciones
  dialog = inject(MatDialog);
  constructor(private router: Router) {}

  openVentana() {
    this.dialog.open(ventanaDialogInforme);
  }

  onOptionClick(option: string) {
    if (option === 'Mis datos') {
      this.router.navigate(['/datos-usuario']);
    }
    if (option === 'Tatuadores') {
      this.router.navigate(['/encargado-tatuadores']);
    }
    if (option === 'Sucursal') {
      this.router.navigate(['/encargado-sucursal']);
    }
    if (option === "Mis Diseños") {
      this.router.navigate(['/tatuador-disenios']);
    }
    if (option === "Mis turnos") {
      this.router.navigate(['/mis-turnos']);
    }
    if (option === "Buscar diseños") {
      this.router.navigate(['/cliente-disenios']);
    }
    if (option === "Buscar diseños") {
      this.router.navigate(['/cliente-disenios']);
    }
    if (option === "Políticas") {
      this.router.navigate(['/encargado-sucursal/politicas']);
    }
    if (option === "Liquidaciones de Sueldo"){
      this.router.navigate(['/encargado-sucursal/sueldos'])
    }
    if (option === "Informes"){
      this.openVentana();
    }
  }
}
