import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';

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
  private router = inject(Router); // Inyecta el Router aquí
  mes: string|null = '';
  anioActual: number =0;
  tatuador = {
    nombreCompleto: ''
  };

  datosGraficoComTat: [string, number][] = [];
  
  ngOnInit():void{
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
  }

  constructor() {
    this.obtenerDatos();
  }

  obtenerNumeroDeMes(mes: string | null): number | null {
    if (mes == null) return null;
    const meses: string[] = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const mesIndex = meses.findIndex(m => m.toLowerCase() === mes.toLowerCase());
    // Si el mes no está en la lista, retornamos null
    if (mesIndex === -1) {
      return null;
    }
    // Retornamos el número del mes sumando 1 (porque findIndex devuelve un índice basado en 0)
    return mesIndex + 1;
  }

  obtenerDatos(): void {
    const fechaActual = new Date();
    this.anioActual = fechaActual.getFullYear()
    this.mes = sessionStorage.getItem('mesSelecionado')
    const mesSelect = this.obtenerNumeroDeMes(this.mes)
    this.http.get<any>(`http://localhost:3000/api/turno/encargado/month/${mesSelect}`).subscribe(
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

        console.log('Datos para el gráfico:', this.datosGraficoComTat.length);
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
      pdf.save(`${this.mes}-${this.anioActual}-Comisiones.pdf`);
    } else {
      console.error('No se pudo obtener la imagen del gráfico');
    }
  }
  
}


