import { Component, AfterViewInit, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

declare var google: any; // Declarar la variable global para Google Charts

@Component({
  selector: 'app-graficos-ingresos',
  standalone: true,
  template: `<div id="chart_div" style="width: 100%; height: 500px;"></div>`,
  styleUrls: ['./graficos.component.scss']
})
export class GraficosIngresosComponent implements AfterViewInit, OnChanges {
  @Input() datosGraficoTat: [string, number][] = []; // Recibe los datos del componente padre

  private chart: any; // Referencia al gráfico
  
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.drawChart();  // Llamamos a la función para dibujar el gráfico después de un pequeño retraso
  }

  ngAfterViewInit(): void {
    // Cargar la biblioteca de Google Charts solo una vez
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si los datos cambian y Google Charts está listo, dibujamos el gráfico
    if (changes['datosGraficoTat'] && this.datosGraficoTat.length) {
      this.drawChart();
    }
  }

  drawChart(): void {
    setTimeout(() => {
      if (this.datosGraficoTat && this.datosGraficoTat.length) {
        // Crear la tabla de datos para Google Charts
        const data = google.visualization.arrayToDataTable([
          ['Tatuador', 'Comisiones'], // Encabezados de la tabla
          ...this.datosGraficoTat // Datos del componente padre
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
  
        const options = {
          title: 'Comisiones por Tatuador en pesos ($)',
          is3D: true,
          slices: { 0: { offset: 0.1 } },
          chartArea: { width: '100%', height: '80%' },
          legend: { position: 'labeled' },
          pieSliceText: 'value', // Mostrar el valor sobre cada porción de la torta
        };
  
        this.chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        this.chart.draw(view, options); // Usar el DataView al dibujar el gráfico
      }  // Llamamos a la función para dibujar el gráfico después de un pequeño retraso
    }, 100);

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
