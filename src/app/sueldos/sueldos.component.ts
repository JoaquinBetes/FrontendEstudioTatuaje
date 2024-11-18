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
    this.http.get<ResponseTatuadores>(`http://localhost:3000/api/tatuador/`).subscribe(
      (response: ResponseTatuadores) => {
        this.listOptions = response.data
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
  }

  openDialog(tatuador: Tatuador, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(SueldoTatuadorDialog, {
      width: '50%',
      height: '90%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: tatuador
    });
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
  fecha_actual = new Date().toISOString().substring(0, 10);
  fecha_inicio = new Date();
  primerDiaMes = new Date(this.fecha_inicio.getFullYear(), this.fecha_inicio.getMonth(), 1).toISOString().substring(0, 10);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Tatuador,
    private dialogRef: MatDialogRef<SueldoTatuadorDialog>
  ) {
    this.tatuador = data; // Ahora tatuador contiene el objeto pasado desde SueldosComponent
  }

  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
    sessionStorage.setItem("liquidacion", "true")
    this.http.get<any>(`http://localhost:3000/api/politicas/1`).subscribe(
      (response: any) => {
        this.comision = response.data.comisionesEstudio
        this.http.get<any>(`http://localhost:3000/api/turno/tatuador/${this.tatuador.dni}/current-month`).subscribe(
          (response: any) => {
            for ( const turno of response.data ){
              const dato: DatosLiquidacion = {
                fechaTatuaje: turno.fechaTurno.substring(0, 10),
                precio: turno.diseño.precioFinal,
                gananciaTatuador: turno.diseño.precioFinal * ( 1 - this.comision),
                gananciaEstudio: turno.diseño.precioFinal*this.comision
              }
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
      },
      (error) => {
        console.error('Error al cargar los datos', error);
      }
    );
  }

}
