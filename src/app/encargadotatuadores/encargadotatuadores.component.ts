import {HttpClient} from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ResponseTatuadores, Tatuador } from '../shared/interfaces';
import { HeaderTattoo } from '../shared/header/header.component.js';

@Component({
  selector: 'app-encargado-tatuadores',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderTattoo
  ],
  templateUrl: './encargadotatuadores.component.html',
  styleUrl: './encargadotatuadores.component.scss'
})
export class EncargadoTatuadoresComponent {
  @Input() listOptions: Tatuador[] = []; // Acepta una lista de opciones
  private http = inject(HttpClient);
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.http.get<ResponseTatuadores>(`http://localhost:3000/api/tatuador/`).subscribe(
      (response: ResponseTatuadores) => {
        this.listOptions = response.data
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
        
      }
    );
  }

  onOptionClick(tatuador: Tatuador) {
    sessionStorage.setItem('encargado','true')
    sessionStorage.setItem('dniUsuario',tatuador.dni.toString())
    this.router.navigate(['/datos-usuario']);
  }
}
