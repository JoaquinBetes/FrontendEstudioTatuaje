import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TattooCard } from '../tattooCard/tattooCard.component.js';

@Component({
  selector: 'app-tattooSection',
  standalone: true,
  imports: [
    MatGridListModule,
    TattooCard,
  ],
  templateUrl: './tattooSection.component.html',
  styleUrl: './tattooSection.component.scss'
})
export class TattooSection {
  
}
