import { ChangeDetectionStrategy, Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { ClienteResponse, TatuadorResponse } from '../interfaces';
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
import {ventanaDialog} from '../ventana/ventana.component.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos',
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
    FormsModule
  ],
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DatosComponent implements OnInit, OnChanges {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  private router = inject(Router); // Inyecta el Router aquí

  @Input() dni: number = 0;
  datosForm!: FormGroup;  // FormGroup para manejar el formulario

  nombreCompleto = '';
  email = '';
  telefono = '';
  redesSociales = '';
  estado = '';
  contrasenia = '';
  error: string | null = null;

  dniActual: string = '';

  esTatuador = (sessionStorage.getItem('tatuador') == 'true') ? true : false;
  esEncargado = (sessionStorage.getItem('encargado') == 'true') ? true : false;
  esCliente = (sessionStorage.getItem('cliente') == 'true') ? true : false;
  puedeEditar = this.esTatuador || this.esEncargado;

  ngOnInit(): void {
    if(!(this.esCliente || this.esTatuador || this.esEncargado)){
      this.router.navigate(['/']);
    }
    if (this.dni) {
      this.cargarDatosUsuario();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dni'] && !changes['dni'].isFirstChange()) {
      this.cargarDatosUsuario();
    }
  }

  private cargarDatosUsuario(): void {
    if (!this.puedeEditar) {
      this.http.get<ClienteResponse>(`http://localhost:3000/api/cliente/${this.dni}`).subscribe(
        (response: ClienteResponse) => {
          this.nombreCompleto = response.data.nombreCompleto;
          this.email = response.data.email;
          this.estado = response.data.estado.toString();
          this.telefono = response.data.telefono.toString();
          this.error = null; // Resetea el mensaje de error si la llamada es exitosa
        },
        (error) => {
          console.error('Error al cargar los datos del cliente', error);
          this.error = 'Error al cargar los datos. Por favor, intenta nuevamente.';
        }
      );
    }else{
      this.http.get<TatuadorResponse>(`http://localhost:3000/api/tatuador/${this.dni}`).subscribe(
        (response: TatuadorResponse) => {
          this.dniActual = Number(response.data.dni).toString();
          this.nombreCompleto = response.data.nombreCompleto;
          this.email = response.data.email;
          this.redesSociales = response.data.redesSociales;
          this.telefono = response.data.telefono.toString();
          this.contrasenia = response.data.contraseña;
          this.error = null; // Resetea el mensaje de error si la llamada es exitosa
        },
        (error) => {
          console.error('Error al cargar los datos del Tatuador', error);
          this.error = 'Error al cargar los datos. Por favor, intenta nuevamente.';
        }
      );
    }
  }

  cancelar(){
    this.router.navigate(['/encargado-tatuadores']);
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }

    actualizarDatos() {
      const data = {
        nombreCompleto: this.nombreCompleto,
        dni: Number(this.dni),
        email: this.email,
        telefono: this.telefono,
        redesSociales: this.redesSociales,  
        contraseña: this.contrasenia
      }

      this.http.put(`http://localhost:3000/api/tatuador/${this.dniActual}`,data).subscribe(
        (response: any) => {
          this.openVentana(response.message); // Envía solo el mensaje
        },
        error => {
          this.openVentana(error.error.message);
        }
      );
    }
}