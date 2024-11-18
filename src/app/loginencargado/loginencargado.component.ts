import { ChangeDetectionStrategy, Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { ClienteResponse, TatuadorResponse } from '../shared/interfaces';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {ventanaDialog} from '../shared/ventana/ventana.component.js';
import { Router } from '@angular/router';
import { HeaderTattoo } from '../shared/header/header.component.js';

@Component({
  selector: 'app-loginencargado',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule, 
    MatProgressBarModule, 
    MatInputModule, 
    MatDividerModule,
    MatFormFieldModule, 
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule ,
    FormsModule,
    HeaderTattoo,
  ],
  templateUrl: './loginencargado.component.html',
  styleUrl: './loginencargado.component.scss'
})
export class LoginEncargadoComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  private router = inject(Router); // Inyecta el Router aquí

  datosForm!: FormGroup;  // FormGroup para manejar el formulario
  dni: number = 0;
  email = '';
  contrasenia = '';
  error: string | null = null;

  ngOnInit(): void {
    const esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;
    const esTatuador: boolean = (sessionStorage.getItem('tatuador') == 'true') ? true : false;
    if( esCliente || esTatuador ){
      this.router.navigate(['/']);
    }
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }

  ingresoEncargado():void {
    const encargado = {
      dni: this.dni,
      email: this.email,
      contraseña: this.contrasenia
    }
    this.http.post<ClienteResponse>(`http://localhost:3000/api/cliente/admin`, encargado).subscribe(
      (response: ClienteResponse) => {
        // Verificar si el email y la contraseña coinciden
        if (response.data.email === this.email && response.data.contraseña === this.contrasenia) {
          sessionStorage.setItem('encargado', 'true');
          sessionStorage.setItem('log-in', 'true');
          this.router.navigate(['/home-encargado']);
      } else {
          // Mostrar un mensaje de error si el email o la contraseña no coinciden
          this.openVentana('El email o la contraseña no coinciden.');
      }
      },
      error => {
          this.openVentana(error.error.message);
      }
    );
  }



}
