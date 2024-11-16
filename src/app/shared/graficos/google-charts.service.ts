import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleChartsService {
  private chartsLoaded = false;
  private chartsLoadedSubject = new Subject<void>();

  constructor() {
    // Cargar Google Charts solo una vez
    if (!this.chartsLoaded) {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => {
        this.chartsLoaded = true;
        this.chartsLoadedSubject.next();
      });
    }
  }

  getChartsLoadedObservable() {
    return this.chartsLoadedSubject.asObservable();
  }
}
