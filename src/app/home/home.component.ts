import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { Diseño } from '../shared/interfaces.js';
import { TattooSection } from '../shared/tattooSection/tattooSection.component.js';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderTattoo,
    TattooSection,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  disenios: Diseño[] = [];
  sacarTurno: boolean = false;
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef); 
  ngOnInit(): void {
    // Elimina el valor de 'encargado' del sessionStorage cuando se carga el componente
    sessionStorage.removeItem('encargado');
    sessionStorage.removeItem('sacar-turno')
    this.http.get<any>(`http://localhost:3000/api/disenio/`).subscribe(
      (response: any) => {
        this.disenios = response.data;
        for (let disenio of this.disenios) {
          // Verifica que la URL ya esté correctamente formada
          if (disenio.imagen && !disenio.imagen.startsWith('http://')) {
            disenio.imagen = `http://localhost:3000${disenio.imagen}`;  // Concatenar solo el dominio base si la imagen tiene la ruta relativa
          }
        }
        // Llama a detectChanges() para forzar la detección de cambios
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al cargar los datos de diseños', error);
      }
    );
  }
}
