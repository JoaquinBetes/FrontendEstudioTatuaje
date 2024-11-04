import { ChangeDetectionStrategy, Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { ClienteResponse, TatuadorResponse } from '../interfaces';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DatosComponent implements OnInit, OnChanges {
  private http = inject(HttpClient);

  @Input() dni: number = 0;

  nombreCompleto = '';
  email = '';
  telefono = '';
  redesSociales = '';
  estado = '';
  error: string | null = null;

  esTatuador = (sessionStorage.getItem('tatuador') == 'true') ? true : false;

  ngOnInit(): void {
    if (this.dni) {
      this.cargarDatosCliente();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dni'] && !changes['dni'].isFirstChange()) {
      this.cargarDatosCliente();
    }
  }

  private cargarDatosCliente(): void {
    if (!this.esTatuador) {
      this.http.get<ClienteResponse>(`http://localhost:3000/api/cliente/${this.dni}`).subscribe(
        (response: ClienteResponse) => {
          this.nombreCompleto = response.data.nombreCompleto;
          this.email = response.data.email;
          this.estado = response.data.estado.toString();
          this.telefono = response.data.telefono.toString();
          this.error = null; // Resetea el mensaje de error si la llamada es exitosa
        },
        (error) => {
          console.error('Error al cargar los datos del cliente', error);
          this.error = 'Error al cargar los datos. Por favor, intenta nuevamente.';
        }
      );
    }else{
      this.http.get<TatuadorResponse>(`http://localhost:3000/api/tatuador/${this.dni}`).subscribe(
        (response: TatuadorResponse) => {
          this.nombreCompleto = response.data.nombreCompleto;
          this.email = response.data.email;
          this.redesSociales = response.data.redesSociales;
          this.telefono = response.data.telefono.toString();
          this.error = null; // Resetea el mensaje de error si la llamada es exitosa
        },
        (error) => {
          console.error('Error al cargar los datos del Tatuador', error);
          this.error = 'Error al cargar los datos. Por favor, intenta nuevamente.';
        }
      );
    }

  }
}