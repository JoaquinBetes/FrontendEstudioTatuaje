import { Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Diseño } from '../shared/interfaces.js';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import { ventanaDialog } from '../shared/ventana/ventana.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Turno, TurnoResponse } from '../shared/interfaces.js';
import {MatSelectModule} from '@angular/material/select';



@Component({
  selector: 'app-clienteturno',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, 
    MatAutocompleteModule,                
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    AsyncPipe,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './clienteturno.component.html',
  styleUrl: './clienteturno.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteTurnoComponent {
  readonly dialogRef = inject(MatDialogRef<ClienteTurnoComponent>);
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  selectedValue: string = "";
  horarios: string [] = ["16:00:00","17:00:00","18:00:00","19:00:00","20:00:00"]
  disenio: Diseño;
  horaInicio: string = ''
  horaFin: string = ''
  fechaTurno: Date = new Date();
  indicaciones: string = '';
  estado: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { disenio: Diseño }) {
    this.disenio = data.disenio;
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }
   sumarUnaHora(hora: string): string {
    // Convertir la hora en formato HH:MM:SS a un objeto Date, usando una fecha arbitraria
    const [horas, minutos, segundos] = hora.split(':').map(Number);
    // Crear un objeto Date con una fecha arbitraria (por ejemplo, 1970-01-01)
    const fecha = new Date(0, 0, 0, horas, minutos, segundos); // 0 para el día, mes y año
    // Sumar una hora (3600000 ms)
    fecha.setHours(fecha.getHours() + 1);
    // Obtener la hora resultante en formato HH:MM:SS
    const nuevaHora = fecha.toTimeString().slice(0, 8); // Obtener la hora en formato HH:MM:SS
    return nuevaHora;
  }

  onDateInput(event: any): void {
    const fecha: Date = event.value
    console.log('Fecha seleccionada:', fecha.getDay());  // Imprime la fecha seleccionada
    // Realiza otras acciones cuando la fecha cambie
  }

  reservarTurno(){
    const turno: Turno = {
      hora_inicio: this.selectedValue,
      hora_fin: this.sumarUnaHora(this.selectedValue),
      fecha_turno: this.fechaTurno,
      tatuador_dni: this.disenio.tatuador.dni,
      cliente_dni: Number.parseInt(sessionStorage.getItem('dniUsuario') || '0'),
      diseño_id: this.disenio.id,
      indicaciones: this.indicaciones,
      estado: 'res'
    }
    this.http.post<TurnoResponse>("http://localhost:3000/api/turno", turno).subscribe(
      (response: TurnoResponse) => {
          this.openVentana(response.message); // Envía solo el mensaje
          this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
      },
      error => {
          this.openVentana(error.error.message);
      }
    );
  }

}
