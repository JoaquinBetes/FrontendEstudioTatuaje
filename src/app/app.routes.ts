import { Routes } from '@angular/router';
import { DatosClienteComponent } from './datoscliente/datoscliente.component.js';
import { HomeComponent } from './home/home.component.js';
import { HomeClienteComponent } from './homecliente/homecliente.component.js';
import { HomeTatuadorComponent } from './hometatuador/hometatuador.component.js';

export const routes: Routes = [
    {
        path: '',
        title: 'Home Page',
        component: HomeComponent,
      },
      {
        path: 'home-cliente',
        title: 'Cliente Home',
        component: HomeClienteComponent,
      },
      { 
        path: 'home-tatuador',
        title: 'Tatuador Home',
         component: HomeTatuadorComponent },
      { 
        path: 'datos-cliente',
        title: 'Datos Cliente',
        component: DatosClienteComponent },

];
