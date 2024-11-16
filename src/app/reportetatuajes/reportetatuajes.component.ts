import { ChangeDetectionStrategy, Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { GraficosComponent } from '../shared/graficos/graficos.component.js';
import { Turno, TurnoConDiseño } from '../shared/interfaces.js';
import { GraficosTatComComponent } from '../shared/graficos/graficostc.component.js';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-reportetatuajes',
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
    GraficosComponent,
    GraficosTatComComponent,
  ],
  templateUrl: './reportetatuajes.component.html',
  styleUrl: './reportetatuajes.component.scss'
})
export class ReporteTatuajesComponent {
  private http = inject(HttpClient);
  tatuador= {
    nombreCompleto:""
  };
  datosGraficoTat: (string | number)[][]= [];
  datosGraficoComTat: (string | number)[][]= [];

  constructor() {
    const dniRaw = sessionStorage.getItem('dni-tatuador'); // Puede ser string o null
    const dni = dniRaw !== null ? Number.parseInt(dniRaw, 10) : 0;
    this.http.get<any>(`http://localhost:3000/api/tatuador/${dni}`).subscribe(
      (response: any) => {
        this.tatuador = response.data
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
    this.http.get<any>(`http://localhost:3000/api/turno/tatuador/${dni}/last-three-months`).subscribe(
      (response: any) => {
        // Crear un objeto para contar los turnos por mes
        const turnos: TurnoConDiseño[] = response.data;
        // Calcular los últimos 3 meses
        const meses: string[] = []; // Especificamos que 'meses' es un arreglo de strings
        const mesActual = new Date().getMonth(); // Obtener el mes actual (0-11)

        for (let i = 2; i >= 0; i--) {
          const fecha = new Date();
          fecha.setMonth(mesActual - i); // Restar meses a la fecha actual
          const mes: string = fecha.toLocaleString('default', { month: 'long' }); // Especificamos que 'mes' es un string
          meses.push(mes);
        }

        const turnosPorMes: number[] = [0, 0, 0]; // Inicializamos el contador para los tres meses
        const comisionesPorMes: number[] = [0, 0, 0]

        // Recorremos los turnos y contamos los que tienen estado "tat"
        turnos.forEach((turno) => {
          const fechaTurno = new Date(turno.fechaTurno);
          const mesIndex = fechaTurno.getMonth(); // 0: Enero, 1: Febrero, 2: Marzo, ...

          // Comprobamos en qué mes se encuentra el turno y lo asignamos al índice correcto
          if (turno.diseño.estado === 'tat') {
            const mesCalculado: number = meses.indexOf(fechaTurno.toLocaleString('default', { month: 'long' }));
            if (mesCalculado !== -1) {
              turnosPorMes[mesCalculado]++; // Incrementamos el contador para el mes correspondiente
              const comisionesRaw = sessionStorage.getItem('comisiones'); // Puede ser string o null
              const comisiones = comisionesRaw !== null ? Number.parseFloat(comisionesRaw) : 0;
              comisionesPorMes[mesCalculado] += (turno.diseño?.precioFinal ?? 0)*comisiones;
            }
          }
        });

        console.log(turnosPorMes); // Verifica el resultado
        console.log(comisionesPorMes)


        // Formar el arreglo con los datos para la gráfica
        this.datosGraficoTat = meses.map((mes, index) => [mes, turnosPorMes[index]]);
        this.datosGraficoComTat = meses.map((mes, index) => [mes, comisionesPorMes[index]]);
        console.log('Datos para el gráfico:', this.datosGraficoTat);
        console.log('Datos para el gráfico:', this.datosGraficoComTat);
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
  }

  descargarPDF(graficosComponent: GraficosComponent, graficosComponentTat:GraficosTatComComponent): void {
    const chartImageURI = graficosComponent.getChartImageURI();
    const chartTatImageURI = graficosComponentTat.getChartImageURI();
    if (chartImageURI) {
      const pdf = new jsPDF();
      // Ajustar tamaño de las imágenes para que encajen en una página (ancho: 180mm, alto: 90mm)
      const anchoImagen = 180;
      const altoImagen = 90;
      // Añadir el primer gráfico a la primera página
      pdf.addImage(chartImageURI, 'PNG', 15, 20, anchoImagen, altoImagen);
      // Crear una nueva página para el segundo gráfico
      pdf.addPage();
      // Añadir el segundo gráfico a la segunda página
      pdf.addImage(chartTatImageURI, 'PNG', 15, 20, anchoImagen, altoImagen);
      pdf.save(`${this.tatuador.nombreCompleto}-Comisiones.pdf`);
    } else {
      console.error('No se pudo obtener la imagen del gráfico');
    }
  }

}
