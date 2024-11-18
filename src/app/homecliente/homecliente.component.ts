import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component.js';

@Component({
  selector: 'app-homecliente',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent
  ],
  templateUrl: './homecliente.component.html',
  styleUrl: './homecliente.component.scss'
})
export class HomeClienteComponent {
  private router = inject(Router); // Inyecta el Router aquí
  listOptions = ["Mis turnos", "Buscar diseños", "Mis datos"];

  ngOnInit(): void {
    const esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;
    if(!esCliente){
      this.router.navigate(['/']);
    }
  }
}

