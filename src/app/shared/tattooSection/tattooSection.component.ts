import { Component, inject, Input ,ChangeDetectorRef } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TattooCard } from '../tattooCard/tattooCard.component.js';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Diseño, Turno } from '../interfaces.js';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteTurnoComponent } from '../../clienteturno/clienteturno.component';
import { CommonModule } from '@angular/common'
import { ventanaDialog, ventanaDialogTurno } from '../ventana/ventana.component.js';
import { ProcesotatuajeComponent } from '../../procesotatuaje/procesotatuaje.component.js';
import { Cliente } from '../interfaces';

@Component({
  selector: 'app-tattooSection',
  standalone: true,
  imports: [
    MatGridListModule,
    TattooCard,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    ClienteTurnoComponent,
    CommonModule,
    
  ],
  templateUrl: './tattooSection.component.html',
  styleUrl: './tattooSection.component.scss',
  
})
export class TattooSection {
  readonly dialog = inject(MatDialog);
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef); 
  @Input() listOptions: Diseño[] = [];
  /* @Input() listOptionsTurnos: Turno[] = []; */
  @Input() sacarTurno: boolean = false;
  @Input() misTurnos:boolean = false;
  @Input() tatuador:boolean = false;
  @Input() tatuadorDisenios:boolean = false;
  clienteEstado:number = 0;
  

  // Getter para ordenar la lista en el orden res > dis > tat
  get sortedListOptions(): Diseño[] {
    const estadoPrioridad: { [key: string]: number } = { res: 1, dis: 2, tat: 3 };
    return this.listOptions.sort((a, b) => {
      const prioridadA = estadoPrioridad[a.estado as keyof typeof estadoPrioridad] || 99;
      const prioridadB = estadoPrioridad[b.estado as keyof typeof estadoPrioridad] || 99;
      return prioridadA - prioridadB;
    });
  }
  

  onDisenioClick(disenio: Diseño): void {
    const dialogRef = this.dialog.open(ClienteTurnoComponent,
      {
      height: '600px',
      width: '600px',
      data: { disenio }  // Aquí pasamos el objeto disenio
    });
    dialogRef.afterClosed().subscribe(result => { 
    });
  }

  ngOnInit(): void {
    console.log(this.listOptions)
    const esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;
    if(esCliente){
      const dniStr = sessionStorage.getItem('dniUsuario');
      const dni: number = dniStr ? Number.parseInt(dniStr) : NaN;  // Usa NaN si es null
      this.http.get<any>(`http://localhost:3000/api/cliente/${dni}`).subscribe(
        (response: any) => {
          this.clienteEstado = response.data.estado
        },
        (error) => {
          console.error('Error al cargar los datos del cliente', error);
        }
      );
    }
  }


  onTurnoClick(disenio: Diseño): void {
    if(this.misTurnos){
      const turno =disenio.turno;
      this.dialog.open(ventanaDialogTurno,
        {
        height: '300px',
        width: '200px',
        data: { turno }  
      });
    }
    if(this.tatuadorDisenios){
      this.dialog.open(ProcesotatuajeComponent,
        {
        height: '600px',
        width: '600px',
        data: { disenio }
      })
    }
  }

  trackByFn(index: number, disenio: Diseño): number {
    return disenio.id;
  }
}
