import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RegistroComponent, RegistroComponentDialog } from '../registro/registro.component';

/**
 * @title Toolbar with just text
 */
@Component({
  selector: 'header-tattoo',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RegistroComponent,
    RegistroComponentDialog,
  ],
})
export class HeaderTattoo {}

