import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-tattoo-card',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tattooCard.component.html',
  styleUrl: './tattooCard.component.scss'
})
export class TattooCard {

}
