import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { HeaderTattoo } from '../header/header.component.js';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Diseño, Turno } from '../interfaces.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TattooSection } from '../tattooSection/tattooSection.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-misturnos',
  standalone: true,
  imports: [
    HeaderTattoo,
    TattooSection,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './misturnos.component.html',
  styleUrl: './misturnos.component.scss'
})
export class MisTurnosComponent {
  readonly dialog = inject(MatDialog);
  private router = inject(Router); // Inyecta el Router aquí
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  disenios: Diseño[] = [];
  turnos: Turno[] = [];
  tatuador:boolean = false
  ngOnInit(): void {
    this.tatuador = sessionStorage.getItem('tatuador') == "true"
    const esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;
    if(!( esCliente || this.tatuador )){
      this.router.navigate(['/']);
    }
    const dni = sessionStorage.getItem('dniUsuario');
    if(this.tatuador) {
      this.http.get<any>(`http://localhost:3000/api/turno/tatuador/${dni}`).subscribe(
        (response: any) => {
        this.turnos = response.data
        for (let turno of response.data){
          turno.diseño.tatuador = turno.tatuador
          turno.diseño.cliente = turno.cliente
          turno.diseño.turno = turno
          this.disenios.push(turno.diseño)
        }
        for (let disenio of this.disenios) {
          // Verifica que la URL ya esté correctamente formada
          if (disenio.imagen && !disenio.imagen.startsWith('http://')) {
            disenio.imagen = `http://localhost:3000${disenio.imagen}`;  // Concatenar solo el dominio base si la imagen tiene la ruta relativa
          }
        }
              // Llama a detectChanges() para forzar la detección de cambios
      this.cdr.detectChanges();
      },  
      (error:any) => {
        console.error('Error al cargar los datos de diseños', error);
      }
    );
  }
  else{
    this.http.get<any>(`http://localhost:3000/api/turno/cliente/${dni}`).subscribe(
      (response: any) => {
      this.turnos = response.data
      for (let turno of response.data){
        turno.diseño.tatuador = turno.tatuador
        turno.diseño.cliente = turno.cliente
        turno.diseño.turno = turno
        this.disenios.push(turno.diseño)
      }
      for (let disenio of this.disenios) {
        // Verifica que la URL ya esté correctamente formada
        if (disenio.imagen && !disenio.imagen.startsWith('http://')) {
          disenio.imagen = `http://localhost:3000${disenio.imagen}`;  // Concatenar solo el dominio base si la imagen tiene la ruta relativa
        }
      }
            // Llama a detectChanges() para forzar la detección de cambios
    this.cdr.detectChanges();
    },  
    (error:any) => {
      console.error('Error al cargar los datos de diseños', error);
    }
  );
  }
  }
}
