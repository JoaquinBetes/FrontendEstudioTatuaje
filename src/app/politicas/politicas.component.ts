import { HeaderTattoo } from '../shared/header/header.component.js';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {ventanaDialog} from '../shared/ventana/ventana.component.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-politicas',
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
  ],
  templateUrl: './politicas.component.html',
  styleUrl: './politicas.component.scss'
})
export class PoliticasComponent {
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef); 
  dialog = inject(MatDialog);
  private router = inject(Router);
  comisiones_estudio: number = 0;
  descuento_maximo: number = 0;
  precio_base_minimo: number = 0;


  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
    sessionStorage.setItem('politicas', 'true')
    this.http.get<any>(`http://localhost:3000/api/politicas/1`).subscribe(
      (response: any) => {
        this.comisiones_estudio = response.data.comisionesEstudio;
        this.descuento_maximo = response.data.descuentoMaximo;
        this.precio_base_minimo = response.data.precioBaseMinimo
        // Llama a detectChanges() para forzar la detección de cambios
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al cargar políticas', error);
      }
    );
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }
  
  cancelar(){
    this.router.navigate(['/home-encargado']);
  }

  editarPoliticas(){
    const politicas = {
      comisionesEstudio: this.comisiones_estudio,
      descuentoMaximo: this.descuento_maximo,
      precioBaseMinimo: this.precio_base_minimo
    }
    this.http.put<any>(`http://localhost:3000/api/politicas/1`,politicas).subscribe(
      (response: any) => {
        this.openVentana(response.message);
        // Llama a detectChanges() para forzar la detección de cambios
        this.cdr.detectChanges();
      },
      (error) => {
        this.openVentana(error.error.message);
      }
    );
  }

}
