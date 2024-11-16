import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderTattoo } from '../shared/header/header.component';
import { GraficosIngresosComponent } from '../shared/graficos/graficosIngresos.component';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-reporteingresos',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderTattoo,
    GraficosIngresosComponent
  ],
  templateUrl: './reporteingresos.component.html',
  styleUrls: ['./reporteingresos.component.scss'],
})
export class ReporteingresosComponent {
  private http = inject(HttpClient);
  mesActualNombre: string = '';
  anioActual: number =0;
  tatuador = {
    nombreCompleto: ''
  };

  datosGraficoComTat: [string, number][] = [];
  

  constructor() {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    const fechaActual = new Date();
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.anioActual = fechaActual.getFullYear()
    this.mesActualNombre = nombresMeses[fechaActual.getMonth()];
    this.http.get<any>(`http://localhost:3000/api/turno/encargado/current-month`).subscribe(
      (response: any) => {
        const turnos: any[] = response.data;
        const comisionesRaw = sessionStorage.getItem('comisiones');
        const comisiones = comisionesRaw !== null ? Number.parseFloat(comisionesRaw) : 0;

        turnos.forEach((turno) => {
          const estats: [string, number] = [
            turno.tatuador.nombreCompleto,
            turno.diseño.precioFinal * comisiones
          ];

          let encontrado = this.datosGraficoComTat.find(
            fila => fila[0] === turno.tatuador.nombreCompleto
          );

          if (encontrado) {
            encontrado[1] += turno.diseño.precioFinal * comisiones;
          } else {
            this.datosGraficoComTat.push(estats);
          }
        });

        console.log('Datos para el gráfico:', this.datosGraficoComTat);
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
  }

  descargarPDF(graficosComponent: GraficosIngresosComponent): void {
    const chartImageURI = graficosComponent.getChartImageURI();
    if (chartImageURI) {
      const pdf = new jsPDF();
      pdf.addImage(chartImageURI, 'PNG', 15, 40, 180, 160);
      pdf.save(`${this.mesActualNombre}-${this.anioActual}-Comisiones.pdf`);
    } else {
      console.error('No se pudo obtener la imagen del gráfico');
    }
  }
  
}


