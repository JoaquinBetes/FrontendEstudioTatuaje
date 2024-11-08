import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TattooCard } from '../tattooCard/tattooCard.component.js';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Diseño } from '../interfaces.js';

@Component({
  selector: 'app-tattooSection',
  standalone: true,
  imports: [
    MatGridListModule,
    TattooCard,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './tattooSection.component.html',
  styleUrl: './tattooSection.component.scss'
})
export class TattooSection {
  @Input() listOptions: Diseño[] = [];
  
}
