import {HttpClient} from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { ResponseTatuadores, Tatuador } from '../shared/interfaces';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { MatDialog } from '@angular/material/dialog';
import { RegistroComponentDialog } from '../shared/registro/registro.component.js';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { SueldoTatuadorDialog } from '../sueldos/sueldos.component.js';

@Component({
  selector: 'app-mesinforme',
  standalone: true,
  imports: [
    MatGridListModule,
    HeaderTattoo,
    FormsModule
  ],
  templateUrl: './mesinforme.component.html',
  styleUrl: './mesinforme.component.scss'
})
export class MesInformeComponent {
  listOptions: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; // Acepta una lista de opciones
  private http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  dniTatuadorSelect = Number.parseInt(sessionStorage.getItem("tatuadorSueldo") ?? "0");
  tatuador: Tatuador|null = null;
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const esEncargado: boolean = (sessionStorage.getItem('encargado') == 'true') ? true : false;
    if(!esEncargado){
      this.router.navigate(['/']);
    }
    if(this.dniTatuadorSelect !== 0){
      this.http.get<any>(`http://localhost:3000/api/tatuador/${this.dniTatuadorSelect}`).subscribe(
          (response: any) => {
            this.tatuador = response.data
          },
          (error) => {
            console.error('Error al cargar los datos', error);
          }
        );
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(RegistroComponentDialog, {
      width: '50%',
      height: '90%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openDialogSueldo(tatuador: Tatuador,mes:string, enterAnimationDuration: string, exitAnimationDuration: string): void {
    sessionStorage.setItem('mesSelecionado', mes)  
    this.dialog.open(SueldoTatuadorDialog, {
      width: '50%',
      height: '90%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: tatuador
    });
  }

  onOptionClick(mes:string) {
    sessionStorage.setItem('mesSelecionado', mes)
    this.router.navigate(['/encargado-sucursal/reporte-ingresos']);
  }

}

