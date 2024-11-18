import { Component, inject } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { DatoSucursal, DatoHorariosAtencion } from '../shared/interfaces.js';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { ventanaDialog } from '../shared/ventana/ventana.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';


const ELEMENT_DATA: DatoHorariosAtencion[] = [];

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [
    HeaderTattoo,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.scss'
})
export class SucursalComponent {

  datosSucursal = {
    pais: '',
    localidad: '',
    direccion: '',
    departamento: '',
    piso: null
  };

  dialog = inject(MatDialog);
  private router = inject(Router); // Inyecta el Router aquí
  displayedColumns: string[] = ['Dia', 'Inicio', 'Fin'];
  dataSource = ELEMENT_DATA

  listOptions: DatoSucursal[] = [
    { nombreDato: "pais", dato: this.datosSucursal.pais },
    { nombreDato: "localidad", dato: this.datosSucursal.localidad },
    { nombreDato: "direccion", dato: this.datosSucursal.direccion },
    { nombreDato: "departamento", dato: this.datosSucursal.departamento },
    { nombreDato: "piso", dato: this.datosSucursal.piso }
  ];

  private http = inject(HttpClient);

  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
    this.cargarDatosUsuario();
  }

  cancelar(){
    this.router.navigate(['/home-encargado']);
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }

  private cargarDatosUsuario(): void {
    
    this.http.get<any>(`http://localhost:3000/api/sucursal/2`).subscribe(
      (response: any) => {
        this.datosSucursal.pais = response.data.pais;
        this.datosSucursal.localidad = response.data.localidad;
        this.datosSucursal.direccion = response.data.direccion;
        this.datosSucursal.departamento = response.data.departamento;
        this.datosSucursal.piso = response.data.piso;

        this.dataSource = response.data.horariosAtenciones   
        console.log(response.data.horariosAtenciones )     
      },
      (error) => {
        console.error('Error al cargar los datos del cliente', error);
      }
    );
  }

  guardarEdicion(): void {
    // Primero actualizamos la sucursal
    this.http.put(`http://localhost:3000/api/sucursal/2`, this.datosSucursal).subscribe(
      (response: any) => {
        // Creamos un array de observables para las actualizaciones de los horarios
        const horarioUpdates = this.dataSource.map(horario => 
          this.http.put(`http://localhost:3000/api/horariosAtencion/${horario.id}`, horario)
        );
  
        // Usamos forkJoin para ejecutar todas las actualizaciones de horarios en paralelo
        forkJoin(horarioUpdates).subscribe(
          (responses) => {
            // Si todas las actualizaciones se completan sin error
            sessionStorage.setItem('sucursal', 'true');
            this.openVentana('Sucursal y horarios actualizados correctamente');
          },
          (error) => {
            // Si ocurre un error en cualquiera de las actualizaciones de horarios
            this.openVentana("El Horario ingresado es invalido");
          }
        );
      },
      (error) => {
        // Si ocurre un error al actualizar la sucursal
        this.openVentana("Alguno de los datos ingresados no es válido");
      }
    );
  }
}
