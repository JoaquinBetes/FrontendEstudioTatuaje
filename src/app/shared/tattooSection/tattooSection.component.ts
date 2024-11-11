import { Component, inject, Input ,ChangeDetectorRef } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TattooCard } from '../tattooCard/tattooCard.component.js';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Diseño } from '../interfaces.js';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClienteTurnoComponent } from '../../clienteturno/clienteturno.component';


@Component({
  selector: 'app-tattooSection',
  standalone: true,
  imports: [
    MatGridListModule,
    TattooCard,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    ClienteTurnoComponent
  ],
  templateUrl: './tattooSection.component.html',
  styleUrl: './tattooSection.component.scss',
  
})
export class TattooSection {
  readonly dialog = inject(MatDialog);
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef); 
  @Input() listOptions: Diseño[] = [];
  @Input() sacarTurno: boolean = false;
  
  onDisenioClick(disenio: Diseño): void {
    console.log('Diseño seleccionado:', disenio);
    const dialogRef = this.dialog.open(ClienteTurnoComponent,
      {
      height: '600px',
      width: '600px',
      data: { disenio }  // Aquí pasamos el objeto disenio
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
  }

  trackByFn(index: number, disenio: Diseño): number {
    return disenio.id;
  }
}
