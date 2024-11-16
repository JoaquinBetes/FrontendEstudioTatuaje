import { Component, AfterViewInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

declare var google: any; // Declarar la variable global para Google Charts

@Component({
  selector: 'app-graficos',
  standalone: true,
  template: `<div id="chart_div" style="width: 100%; height: 500px;"></div>`,
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements AfterViewInit, OnChanges {
  @Input() datosGraficoTat: (string | number)[][] = []; // Recibe los datos de un componente padre
  private chart: any; // Referencia al gráfico
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Cargar la biblioteca de Google Charts solo una vez
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Accedemos a datosGraficoTat con notación de índice
    if (changes['datosGraficoTat'] && this.datosGraficoTat.length) {
      this.drawChart();
    }
  }

  drawChart(): void {
    // Verificamos que los datos estén disponibles antes de generar el gráfico
    if (this.datosGraficoTat && this.datosGraficoTat.length) {
      const data = google.visualization.arrayToDataTable([
        ['Mes', 'Cantidad de tatuajes realizados'],
        ...this.datosGraficoTat, // Usamos los datos pasados desde el componente padre
      ]);
      // Usar DataView para crear una nueva columna de anotaciones
      const view = new google.visualization.DataView(data);
      view.setColumns([
        0, 1,
        {
          calc: "stringify", // Calcular la anotación con el valor de la columna 1
          sourceColumn: 1, // Usar la columna 1 para el valor
          type: "string",
          role: "annotation", // Establecer el rol como "annotation"
        },
      ]);

      // Configuración del gráfico
      const options = {
        title: 'Cantidad de tatuajes por mes',
        chartArea: { width: '70%', height: '70%' }, // Ajustar área del gráfico
        hAxis: {
          title: 'Meses',
          minValue: 0, // Evitar que las barras comiencen debajo de 0
        },
        vAxis: {
          title: 'Cantidad',
        },
        legend: { position: 'none' }, // Ocultar leyenda
        
      };

      // Crear el gráfico y renderizarlo en el div
      this.chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      this.chart.draw(view, options);
    }
  }

  getChartImageURI(): string {
    if (this.chart) {
      return this.chart.getImageURI();
    } else {
      console.error('El gráfico no está listo');
      return '';
    }
  }

}


