import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { TattooSection } from '../shared/tattooSection/tattooSection.component.js';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Diseño } from '../shared/interfaces.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';


@Component({
  selector: 'app-clientedisenios',
  standalone: true,
  imports: [
    HeaderTattoo,
    TattooSection,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './clientedisenios.component.html',
  styleUrl: './clientedisenios.component.scss',
  
})
export class ClienteDiseniosComponent {
  readonly dialog = inject(MatDialog);
  private router = inject(Router); // Inyecta el Router aquí
  http = inject(HttpClient)
  cdr = inject(ChangeDetectorRef); 
  @ViewChild('inputCat') inputCat!: ElementRef<HTMLInputElement>;
  @ViewChild('inputTat') inputTat!: ElementRef<HTMLInputElement>;
  disenios: Diseño[] = [];
  sacarTurno: boolean = true;
  categoria: number = 0;
  tatuador: number = 0;
  options: { codigo: number, descripcion: string }[] = [];  // Almacena codigo y descripcion
  filteredOptions: { codigo: number, descripcion: string }[] = [];
  optionsTat: { dni: number, nombreCompleto: string }[] = [];  // Almacena dni y nombreCompleto
  filteredOptionsTat: { dni: number, nombreCompleto: string }[] = [];

  // FormControls for autocompletion
  tatuadorControl = new FormControl('');
  categoriaControl = new FormControl('');

  constructor() {
    this.categoriaControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        // Filtramos solo si el valor es string (es decir, si el usuario está escribiendo)
        const selectedOption = this.options.find(option => option.descripcion === value);
        this.categoria = selectedOption ? selectedOption.codigo : 0;
      }
    });

    this.tatuadorControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        // Filtramos solo si el valor es string (es decir, si el usuario está escribiendo)
        const selectedOption = this.optionsTat.find(option => option.nombreCompleto === value);
        this.tatuador = selectedOption ? selectedOption.dni : 0;
      }
    });

    this.http.get<any>("http://localhost:3000/api/categoria").subscribe(
      (response: any) => {
        this.options = response.data.map((categoria: any) => ({
          codigo: categoria.codigo,
          descripcion: categoria.descripcion
        }));
        this.filteredOptions = this.options.slice();
      },
      (error) => {
        console.error(error.error.message);
      }
    );

    this.http.get<any>("http://localhost:3000/api/tatuador").subscribe(
      (response: any) => {
        this.optionsTat = response.data.map((tatuador: any) => ({
          dni: tatuador.dni,
          nombreCompleto: tatuador.nombreCompleto
        }));
        this.filteredOptionsTat = this.optionsTat.slice();
      },
      (error) => {
        console.error(error.error.message);
      }
    );
  }

  displayOption(option: { codigo: number; descripcion: string } | null): string {
    return option ? option.descripcion : '';
  }
  displayOptionTat(option: { id: number; nombreCompleto: string } | null): string {
    return option ? option.nombreCompleto : '';
  }

  onOptionSelected(selectedOption: { codigo: number, descripcion: string }): void {
    // Verifica que el objeto tenga los valores correctos
    if (selectedOption && selectedOption.codigo !== undefined) {
      this.categoria = selectedOption.codigo;
    } else {
      console.error("El objeto seleccionado no contiene un 'codigo' válido:", selectedOption);
    }
  }
  onOptionSelectedTat(selectedOptionTat: { dni: number, nombreCompleto: string }): void {
    // Verifica que el objeto tenga los valores correctos
    if (selectedOptionTat && selectedOptionTat.dni !== undefined) {
      this.tatuador = selectedOptionTat.dni;
    } else {
      console.error("El objeto seleccionado no contiene un 'dni' válido:", selectedOptionTat);
    }
  }

// Para Tatuador
  filterTat(): void {
    const filterValue = this.inputTat.nativeElement.value.toLowerCase();
    this.filteredOptionsTat = this.optionsTat.filter(o => 
      o.nombreCompleto.toLowerCase().includes(filterValue)
    );
  }
  // Para Categoría
  filterCat(): void {
    const filterValue = this.inputCat.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => 
      o.descripcion.toLowerCase().includes(filterValue)
    );
  }

  buscar():void {
    this.http.get<any>(`http://localhost:3000/api/disenio/cliente/${this.tatuador}/${this.categoria}/dis`).subscribe(
      (response: any) => {
        this.disenios = response.data;
        for (let disenio of this.disenios) {
          // Verifica que la URL ya esté correctamente formada
          if (disenio.imagen && !disenio.imagen.startsWith('http://')) {
            disenio.imagen = `http://localhost:3000${disenio.imagen}`;  // Concatenar solo el dominio base si la imagen tiene la ruta relativa
          }
        }
        // Llama a detectChanges() para forzar la detección de cambios
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error.error.message);
      }
    );
  }
  

  ngOnInit(): void {
    const esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;
    if(!esCliente){
      this.router.navigate(['/']);
    }
    this.http.get<any>(`http://localhost:3000/api/disenio/cliente/dis`).subscribe(
      (response: any) => {
        this.disenios = response.data;
        for (let disenio of this.disenios) {
          // Verifica que la URL ya esté correctamente formada
          if (disenio.imagen && !disenio.imagen.startsWith('http://')) {
            disenio.imagen = `http://localhost:3000${disenio.imagen}`;  // Concatenar solo el dominio base si la imagen tiene la ruta relativa
          }
        }
        // Llama a detectChanges() para forzar la detección de cambios
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al cargar los datos de diseños', error);
      }
    );
  }

}
