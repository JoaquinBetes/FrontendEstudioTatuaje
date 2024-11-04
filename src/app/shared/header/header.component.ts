import {Component} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RegistroComponent, RegistroComponentDialog } from '../registro/registro.component';
import { IngresarComponent } from '../../ingresar/ingresar.component.js';
/**
 * @title Toolbar with just text
 */
@Component({
  selector: 'header-tattoo',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RegistroComponent,
    RegistroComponentDialog,
    IngresarComponent,
    RouterLink,
    RouterOutlet,
  ],
})
export class HeaderTattoo {
  router: any;

  // Método que verifica si hay un DNI guardado en sessionStorage
  isClienteLoggedIn(): boolean {
    return sessionStorage.getItem('dniCliente') !== null;
  }
    // Método para salir
  logout(): void {
    sessionStorage.removeItem('dniCliente'); // Borra el DNI del sessionStorage
    this.router.navigate(['/']);
  }
}

