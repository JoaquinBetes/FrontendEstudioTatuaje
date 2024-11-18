import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { OptionsSectionComponent } from '../shared/optionsSection/optionsSection.component.js';

@Component({
  selector: 'app-hometatuador',
  standalone: true,
  imports: [
    HeaderTattoo,
    OptionsSectionComponent
  ],
  templateUrl: './hometatuador.component.html',
  styleUrl: './hometatuador.component.scss'
})
export class HomeTatuadorComponent {
  private router = inject(Router); // Inyecta el Router aquí
  listOptions = ["Mis turnos", "Mis Diseños", "Mis datos"];

  ngOnInit(): void {
    const esTatuador: boolean = (sessionStorage.getItem('tatuador') == 'true') ? true : false;
    if(!esTatuador){
      this.router.navigate(['/']);
    }
  }
}