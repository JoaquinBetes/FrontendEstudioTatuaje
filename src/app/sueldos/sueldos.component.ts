import {HttpClient} from '@angular/common/http';
import { Component, Inject, inject, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ResponseTatuadores, Tatuador, DatosLiquidacion } from '../shared/interfaces';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { RegistroComponentDialog } from '../shared/registro/registro.component.js';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ventanaDialog } from '../shared/ventana/ventana.component';
import { jsPDF } from "jspdf";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-sueldos',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderTattoo,
    FormsModule
  ],
  templateUrl: './sueldos.component.html',
  styleUrl: './sueldos.component.scss'
})
export class SueldosComponent {
  @Input() listOptions: Tatuador[] = []; // Acepta una lista de opciones
  private http = inject(HttpClient);
  readonly dialog = inject(MatDialog);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
    sessionStorage.removeItem("tatuadorSueldo")
    this.http.get<ResponseTatuadores>(`http://localhost:3000/api/tatuador/`).subscribe(
      (response: ResponseTatuadores) => {
        this.listOptions = response.data
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
  }

  elegirMes(tatuador:Tatuador):void {
    sessionStorage.setItem("tatuadorSueldo", tatuador.dni.toString())
    this.router.navigate(['/encargado-sucursal/reporte-mes']);
  }


}

@Component({
  selector: 'app-sueldos-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,              
    ReactiveFormsModule,       
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './sueldoTatuadorDialog.html',
  styleUrl: './sueldos.component.scss'
})
export class SueldoTatuadorDialog {
  @Input() listOptions: Tatuador[] = []; // Acepta una lista de opciones
  dialog = inject(MatDialog);
  http = inject(HttpClient)
  private router = inject(Router); // Inyecta el Router aquí
  tatuador: Tatuador;
  datosLiquidacion: DatosLiquidacion[] = [];
  comision: number = 0;
  total: number = 0;
  totalTatuador: number = 0;
  totalEstudio: number = 0;
  mes: string|null = '';
  fecha_actual: string = '';
  fecha_inicio: string = '';
  primerDiaMes: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tatuador,
    private dialogRef: MatDialogRef<SueldoTatuadorDialog>
  ) {
    this.tatuador = data; // Ahora tatuador contiene el objeto pasado desde SueldosComponent
  }

  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if (!esEncargado) {
      this.router.navigate(['/']);
    }
    sessionStorage.setItem("liquidacion", "true");
    // Inicializar las fechas dinámicamente
    this.mes = sessionStorage.getItem('mesSelecionado');
    const mesSelect = this.obtenerNumeroDeMes(this.mes);
    
    if (mesSelect) {
      const currentYear = new Date().getFullYear();
      const selectedMonthDate = new Date(currentYear, mesSelect - 1); // Fecha para el mes seleccionado
  
      // Fecha de inicio del mes seleccionado
      this.primerDiaMes = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth(), 1).toISOString().substring(0, 10);
  
      // Fecha actual o el último día del mes seleccionado
      if (selectedMonthDate.getMonth() === new Date().getMonth() && selectedMonthDate.getFullYear() === new Date().getFullYear()) {
        // Si el mes seleccionado es el actual
        this.openVentana("El mes selecionado aun esta en transcurso. No se aconseja emitir comprobantes al ser suceptible a cambios")
        this.fecha_actual = new Date().toISOString().substring(0, 10);
      } else {
        // Si el mes seleccionado no es el actual
        this.fecha_actual = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 0).toISOString().substring(0, 10); // Último día del mes seleccionado
      }
    }
  
    this.http.get<any>(`http://localhost:3000/api/politicas/1`).subscribe(
      (response: any) => {
        this.comision = response.data.comisionesEstudio;
        this.http.get<any>(`http://localhost:3000/api/turno/tatuador/${this.tatuador.dni}/month/${mesSelect}`).subscribe(
          (response: any) => {
            for (const turno of response.data) {
              const dato: DatosLiquidacion = {
                fechaTatuaje: turno.fechaTurno.substring(0, 10),
                precio: turno.diseño.precioFinal,
                gananciaTatuador: turno.diseño.precioFinal * (1 - this.comision),
                gananciaEstudio: turno.diseño.precioFinal * this.comision,
              };
              this.datosLiquidacion.push(dato);
              this.total += dato.precio;
              this.totalTatuador += dato.gananciaTatuador;
              this.totalEstudio += dato.gananciaEstudio;
            }
          },
          (error) => {
            console.error('Error al cargar los datos', error);
          }
        );
      },
      (error) => {
        console.error('Error al cargar los datos', error);
      }
    );
  }
  
  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
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

  guardarLiquidacion():void {
  const pdf = new jsPDF();
  pdf.text(`Liquidación de Sueldos`, 10, 10);
  pdf.text(`Nombre Completo: ${this.tatuador.nombreCompleto}`, 10, 20);
  pdf.text(`DNI: ${this.tatuador.dni}`, 10, 30);
  pdf.text(`Comisión: ${(this.comision * 100).toFixed(2)}%`, 10, 40);
  pdf.text(`Desde: ${this.primerDiaMes}`, 10, 50);
  pdf.text(`Hasta: ${this.fecha_actual}`, 10, 60);

  let offsetY = 70;
  this.datosLiquidacion.forEach(dato => {
    pdf.text(`Fecha: ${dato.fechaTatuaje}`, 10, offsetY);
    pdf.text(`Precio: $${dato.precio}`, 10, offsetY + 10);
    pdf.text(`Ganancia Tatuador: $${dato.gananciaTatuador}`, 10, offsetY + 20);
    pdf.text(`Ganancia Estudio: $${dato.gananciaEstudio}`, 10, offsetY + 30);
    offsetY += 40;
  });

  pdf.text(`Total: $${this.total}`, 10, offsetY);
  pdf.text(`Total Tatuador: $${this.totalTatuador}`, 10, offsetY + 10);
  pdf.text(`Total Estudio: $${this.totalEstudio}`, 10, offsetY + 20);

  pdf.save('Liquidacion-Tatuador.pdf');
  }

  emitirLiquidacion():void{
    let sueldo = 0;
    for ( const dato of this.datosLiquidacion  ){
      sueldo += dato.gananciaTatuador;
    }
    const liquidacion = 
    {
      tatuador_dni: this.tatuador.dni,
      fecha_inicio_liquidacion:this.primerDiaMes,
      fecha_fin_liquidacion: this.fecha_actual,
      valor_total: sueldo
    }
    this.http.post<any>(`http://localhost:3000/api/liquidacion/`, liquidacion).subscribe(
      (response: any) => {
        this.openVentana(`Liquidación emitida a fecha ${this.fecha_actual}`)
        let correo= this.tatuador.email
        const fecha = new Date();
        const horas = fecha.getHours(); // Horas (0-23)
        const minutos = fecha.getMinutes(); // Minutos (0-59)
        const segundos = fecha.getSeconds(); // Segundos (0-59)
        const hora = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        const mail ={
          email: correo,
          asunto: "Liquidaciones de Sueldos",
          mensaje: `
          <p>El día de la fecha <strong>${fecha.toISOString().split('T')[0]}</strong> y hora <strong>${hora}</strong> se ha emitido la liquidación de sueldos.</p>
          <h3>Datos del Tatuador:</h3>
          <ul>
            <li><strong>Nombre Completo:</strong> ${this.tatuador.nombreCompleto}</li>
            <li><strong>DNI:</strong> ${this.tatuador.dni}</li>
          </ul>
          <h3>Periodo:</h3>
          <ul>
            <li><strong>Desde:</strong> ${this.primerDiaMes}</li>
            <li><strong>Hasta:</strong> ${this.fecha_actual}</li>
          </ul>
          <h3>Detalles de la Liquidación:</h3>
          <ul>
            ${this.datosLiquidacion.map(dato => `
              <li>
                <strong>Fecha:</strong> ${dato.fechaTatuaje}<br>
                <strong>Precio:</strong> $${dato.precio}<br>
                <strong>Tatuador:</strong> $${dato.gananciaTatuador}<br>
                <strong>Estudio:</strong> $${dato.gananciaEstudio}
              </li>
            `).join('')}
          </ul>
          <h3>Totales:</h3>
          <ul>
            <li><strong>Total:</strong> $${this.total}</li>
            <li><strong>Total Tatuador:</strong> $${this.totalTatuador}</li>
            <li><strong>Total Estudio:</strong> $${this.totalEstudio}</li>
          </ul>
        `
        }
        this.http.post<any>("http://localhost:3000/api/email/enviar-correo", mail).subscribe(
          (response: any) => {
              this.openVentana(`Informe enviado a ${this.tatuador.nombreCompleto} con DNI ${this.tatuador.dni}`); // Envía solo el mensaje
              this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
          },
          error => {
              this.openVentana(error.error.message);
          }
        );
    },
    (error:any) => {
      console.error('Error', error);
    });
  }
}
