import { Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Diseño, TurnosResponse } from '../shared/interfaces.js';
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
import { Horarios } from '../shared/interfaces';



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
  horarios: string [] = []
  disenio: Diseño;
  horaInicio: string = ''
  horaFin: string = ''
  fechaTurno: Date = new Date();
  indicaciones: string = '';
  estado: string = '';
  dias: Horarios[]  = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { disenio: Diseño }) {
    this.disenio = data.disenio;
  }
  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/horariosAtencion`).subscribe(
      (response: any) => {
        for (let dia of response.data){
          let diaAct: Horarios = {
            dia: dia.dia_semana,
            horaApertura: dia.hora_apertura,
            horaCierre: dia.hora_cierre
          }
          this.dias.push(diaAct)
        }
      },
      (error) => {
        console.error('Error al cargar los datos de diseños', error);
      }
    );
  }

  generarHorarios(objetoHorario: Horarios) {
    const horarios = [];
    let horaActual = new Date(`1970-01-01T${objetoHorario.horaApertura}`);
    const horaFinal = new Date(`1970-01-01T${objetoHorario.horaCierre}`);
/*     // Si la hora de cierre es "00:00:00", interpretamos que es a medianoche del día siguiente
    if (horaFinal.getTime() === horaActual.getTime()) {
        horaFinal.setDate(horaFinal.getDate() + 1); // Añadir un día
    } */
    // Generar horarios en intervalos de una hora
    while (horaActual < horaFinal) {
        // Formatear la hora en "HH:mm:ss"
        const horaString = horaActual.toTimeString().slice(0, 8);
        horarios.push(horaString);

        // Avanzar una hora
        horaActual.setHours(horaActual.getHours() + 2);
    }
    return horarios;
}

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }
   sumarDosHoras(hora: string): string {
    // Convertir la hora en formato HH:MM:SS a un objeto Date, usando una fecha arbitraria
    const [horas, minutos, segundos] = hora.split(':').map(Number);
    // Crear un objeto Date con una fecha arbitraria (por ejemplo, 1970-01-01)
    const fecha = new Date(0, 0, 0, horas, minutos, segundos); // 0 para el día, mes y año
    // Sumar una hora (3600000 ms)
    fecha.setHours(fecha.getHours() + 2);
    // Obtener la hora resultante en formato HH:MM:SS
    const nuevaHora = fecha.toTimeString().slice(0, 8); // Obtener la hora en formato HH:MM:SS
    return nuevaHora;
  }
  filterTimes(mainTimes: string[], timesToRemove: string[]): string[] {
    // Convertimos los tiempos a Date para poder hacer comparaciones de intervalos
    const mainDates = mainTimes.map(time => new Date(`1970-01-01T${time}Z`));
    const removeDates = timesToRemove.map(time => new Date(`1970-01-01T${time}Z`));
    // Filtramos mainTimes, eliminando aquellos horarios que coincidan o estén en el intervalo
    return mainTimes.filter((time, index) => {
        const current = mainDates[index];
        const next = mainDates[index + 1] || null;
        return !removeDates.some(removeDate => {
            // Si coincide exactamente
            if (removeDate.getTime() === current.getTime()) return true;
            // Si está en el intervalo actual - next
            if (next && removeDate > current && removeDate < next) return true;
            return false;
        });
    });
}

  onDateInput(event: any): void {
    const fecha: Date = event.value
    const fechaFormateada = fecha.toISOString().split('T')[0];
    const horariosOcupados: string[] = []; 
    this.http.get<any>(`http://localhost:3000/api/turno/tatuador/${this.disenio.tatuador.dni}/fecha/${fechaFormateada}`).subscribe(
      (response: any) => {
        for ( const horario of response.data ) {
          horariosOcupados.push(horario.horaInicio)
        }
        this.horarios = this.filterTimes(this.generarHorarios(this.dias[fecha.getDay()]), horariosOcupados)
      },
      (error) => {
        console.error('Error al cargar los datos de diseños', error);
      }
    );
  }

  reservarTurno(){
    const turno: Turno = {
      hora_inicio: this.selectedValue,
      hora_fin: this.sumarDosHoras(this.selectedValue),
      fecha_turno: this.fechaTurno,
      tatuador_dni: this.disenio.tatuador.dni,
      cliente_dni: Number.parseInt(sessionStorage.getItem('dniUsuario') || '0'),
      diseño_id: this.disenio.id,
      indicaciones: this.indicaciones,
      estado: 'pen'
    }
    this.http.post<TurnoResponse>("http://localhost:3000/api/turno", turno).subscribe(
      (response: TurnoResponse) => {
        const mail ={
          email: this.disenio.tatuador.email,
          asunto: "Un turno a sido reservado",
          mensaje: "Por favor confirmar el turno con 24hs de anticipación"
      }
        this.http.post<any>("http://localhost:3000/api/email/enviar-correo", mail).subscribe(
          (response: any) => {
              this.openVentana("Reserva completada. El tatuador será informado vía mail, en breve recibira una respuesta del tatuador"); // Envía solo el mensaje
              this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
          },
          error => {
              this.openVentana(error.error.message);
          }
        );
      },
      error => {
          this.openVentana(error.error.message);
      }
    );
  }

}
