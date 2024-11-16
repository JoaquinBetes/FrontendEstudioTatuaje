import {HttpClient} from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ResponseTatuadores, Tatuador } from '../shared/interfaces';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { MatDialog } from '@angular/material/dialog';
import { RegistroComponentDialog } from '../shared/registro/registro.component.js';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-informestatuadores',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderTattoo,
    FormsModule
  ],
  templateUrl: './informestatuadores.component.html',
  styleUrl: './informestatuadores.component.scss'
})
export class InformesTatuadoresComponent {
  @Input() listaTatuadores: Tatuador[] = []; // Acepta una lista de opciones
  private http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    sessionStorage.setItem('encargado', 'true');
    this.http.get<ResponseTatuadores>(`http://localhost:3000/api/tatuador/`).subscribe(
      (response: ResponseTatuadores) => {
        this.listaTatuadores = response.data
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );

  }

  onOptionClick(tatuador: Tatuador) {
    sessionStorage.setItem('dni-tatuador', tatuador.dni.toString())
    this.router.navigate(['/encargado-sucursal/reporte-tatuajes']);
  }
}
