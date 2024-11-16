import { Component, inject } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-homeencargadoestudio',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent,
  ],
  templateUrl: './homeencargadoestudio.component.html',
  styleUrl: './homeencargadoestudio.component.scss'
})
export class HomeEncargadoEstudioComponent {
  listOptions = ["Tatuadores", "Sucursal", "Políticas", "Liquidaciones de Sueldo", "Informes"];
  private http = inject(HttpClient);
  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/politicas/1`).subscribe(
      (response: any) => {
        sessionStorage.setItem('comisiones', response.data.comisionesEstudio.toString());
      },
      (error) => {
        console.error('Error al cargar los datos del Tatuador', error);
      }
    );
    sessionStorage.setItem('encargado', 'true');
    sessionStorage.removeItem('sucursal')
    sessionStorage.removeItem('politicas')
  }
}
