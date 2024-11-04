import { Component } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { DatosComponent } from '../shared/datos/datos.component.js';

@Component({
  selector: 'app-datosCliente',
  standalone: true,
  imports: [HeaderTattoo, DatosComponent],
  templateUrl: './datoscliente.component.html',
  styleUrl: './datoscliente.component.scss'
})
export class DatosClienteComponent {
  dni: number = Number(sessionStorage.getItem('dniUsuario')) 
}
