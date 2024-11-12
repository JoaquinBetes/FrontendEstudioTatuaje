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
    CommonModule
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


  onTurnoClick(disenio: Diseño): void {
    if(this.misTurnos){
      const turno =disenio.turno;
      this.dialog.open(ventanaDialogTurno,
        {
        height: '300px',
        width: '200px',
        data: { turno }  // Aquí pasamos el objeto disenio
      });
    }
  }

  trackByFn(index: number, disenio: Diseño): number {
    return disenio.id;
  }
}
