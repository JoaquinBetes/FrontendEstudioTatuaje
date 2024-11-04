import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component.js';
import { HomeClienteComponent } from './homecliente/homecliente.component.js';

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
];
