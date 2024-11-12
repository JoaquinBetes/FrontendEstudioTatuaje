import { Routes } from '@angular/router';
import { DatosClienteComponent } from './datosusuario/datoscliente.component';
import { HomeComponent } from './home/home.component';
import { HomeClienteComponent } from './homecliente/homecliente.component';
import { HomeTatuadorComponent } from './hometatuador/hometatuador.component';
import { HomeEncargadoEstudioComponent } from './homeencargadoestudio/homeencargadoestudio.component';
import { EncargadoTatuadoresComponent } from './encargadotatuadores/encargadotatuadores.component';
import { SucursalComponent } from './sucursal/sucursal.component.js';
import { TatuadorDiseniosComponent } from './tatuadordisenios/tatuadordisenios.component.js';
import { ClienteDiseniosComponent } from './clientedisenios/clientedisenios.component.js';
import { MisTurnosComponent } from './shared/misturnos/misturnos.component.js';
import { PoliticasComponent } from './politicas/politicas.component.js';

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
        component: HomeTatuadorComponent 
      },
      { 
        path: 'home-encargado',
        title: 'Encargado Home',
        component: HomeEncargadoEstudioComponent
      },
      { 
        path: 'datos-usuario',
        title: 'Datos',
        component: DatosClienteComponent 
      },
      { 
        path: 'encargado-tatuadores',
        title: 'Tatuadores',
        component: EncargadoTatuadoresComponent 
      },
      { 
        path: 'encargado-sucursal',
        title: 'Sucursal',
        component: SucursalComponent 
      },
      { 
        path: 'tatuador-disenios',
        title: 'Diseños',
        component: TatuadorDiseniosComponent
      },
      { 
        path: 'cliente-disenios',
        title: 'Diseños',
        component: ClienteDiseniosComponent
      },
      { 
        path: 'mis-turnos',
        title: 'Turnos',
        component: MisTurnosComponent
      },
      { 
        path: 'encargado-sucursal/politicas',
        title: 'Politicas',
        component: PoliticasComponent
      },
];
