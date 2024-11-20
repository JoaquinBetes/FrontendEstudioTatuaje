import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { TattooSection } from '../shared/tattooSection/tattooSection.component.js';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Diseño } from '../shared/interfaces.js';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import { ventanaDialog } from '../shared/ventana/ventana.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
  MatDialog,
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tatuador-disenios',
  standalone: true,
  imports: [
    HeaderTattoo,
    TattooSection,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tatuadordisenios.component.html',
  styleUrl: './tatuadordisenios.component.scss'
})
export class TatuadorDiseniosComponent {
  readonly dialog = inject(MatDialog);
  http = inject(HttpClient)
  private router = inject(Router); // Inyecta el Router aquí
  cdr = inject(ChangeDetectorRef); 
  disenios: Diseño[] = [];

  ngOnInit(): void {
    const esTatuador: boolean = (sessionStorage.getItem('tatuador') == 'true') ? true : false;
    if(!esTatuador){
      this.router.navigate(['/']);
    }
    let dni = sessionStorage.getItem("dniUsuario")
    this.http.get<any>(`http://localhost:3000/api/disenio/tatuador/${dni}`).subscribe(
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
  
  

  openDialog() {
    const dialogRef = this.dialog.open(TatuadorDiseñosDialog,
      {
      height: '600px',
      width: '600px',
    });
  }
}

@Component({
  selector: 'tatuador-disenios-dialog',
  templateUrl: './tatuadordiseniosDialog.component.html',
  styleUrl: './tatuadordisenios.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, 
    MatAutocompleteModule,                
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TatuadorDiseñosDialog {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: { id: number, descripcion: string }[] = [];  // Almacena id y descripcion
  filteredOptions: { id: number, descripcion: string }[] = [];
  readonly dialogRef = inject(MatDialogRef<TatuadorDiseñosDialog>);
  http = inject(HttpClient);
  dialog = inject(MatDialog);

  estados: { label: string, value: string }[] = [
    { label: "Disponible", value: "dis" },
    { label: "Reservado", value: "res" },
    { label: "Tatuado", value: "tat" }
  ];

  categoria: number = 0;
  tamanio: number = 0;
  colores: string = '';
  imagen: File | null = null;
  estado: string = '';
  precioBase: number = 0;
  descuento: number = 0;
  precioFinal: number = 0;

  constructor() {
    this.myControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        // Filtramos solo si el valor es string (es decir, si el usuario está escribiendo)
        const selectedOption = this.options.find(option => option.descripcion === value);
        this.categoria = selectedOption ? selectedOption.id : 0;
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
        this.openVentana(error.error.message);
      }
    );
  }

    // Método para manejar la selección de estado
  onEstadoSelected(selectedLabel: string): void {
    const selectedEstado = this.estados.find(estado => estado.label === selectedLabel);
    this.estado = selectedEstado ? selectedEstado.value : '';
    console.log("Estado asignado:", this.estado);
  }

  displayOption(option: { codigo: number; descripcion: string } | null): string {
    return option ? option.descripcion : '';
  }

  onOptionSelected(selectedOption: { codigo: number, descripcion: string }): void {
    // Verifica que el objeto tenga los valores correctos
    if (selectedOption && selectedOption.codigo !== undefined) {
      this.categoria = selectedOption.codigo;
    } else {
      console.error("El objeto seleccionado no contiene un 'codigo' válido:", selectedOption);
    }
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => 
      o.descripcion.toLowerCase().includes(filterValue)
    );
  }

  openVentana(e: any) {
    this.dialog.open(ventanaDialog, { data: e });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Solo se permiten archivos JPG, JPEG y PNG.');
        return;
      }
      this.imagen = file;
    }
  }

  guardarDisenio() {
    if (!this.tamanio) {
      alert("Por favor ingresa un tamaño aproximado.");
      return;
    }
    if (!this.categoria) {
      console.log(this.categoria);
      alert("Por favor ingresa una categoria");
      return;
    }
    if (!this.precioBase) {
      alert("Por favor ingresa un precio base");
      return;
    }
/*     if (this.estado.length < 3) {
      alert("Por favor ingresa un estado valido");
      return;
    } */

    const formData = new FormData();
    formData.append("categoria_codigo", this.categoria.toString());
    formData.append("tamanio_aproximado", this.tamanio.toString());
    formData.append("tatuador_dni", sessionStorage.getItem("dniUsuario") || "");
    formData.append("precio_base", this.precioBase.toString());
    formData.append("descuento", this.descuento.toString());
    formData.append("precio_final", this.precioFinal.toString());
    formData.append("estado", this.estado);
    formData.append("colores", this.colores);

    if (this.imagen) {
      formData.append("imagen", this.imagen, this.imagen.name);
    } else {
      this.openVentana("debes seleccionar una imagen");
      return;
    }

    this.http.get<any>("http://localhost:3000/api/politicas/1").subscribe(
      (response: any) => {
        if( (this.precioBase < response.data.precioBaseMinimo) || (this.descuento > response.data.descuentoMaximo) ){
          this.openVentana("Los valores de descuento o el precio base no respetan las politicas del estudio");
        }
        else{
          this.http.post<any>("http://localhost:3000/api/disenio", formData).subscribe(
            (response: any) => {
              this.openVentana(response.message);
              this.dialogRef.close();
            },
            (error) => {
              this.openVentana(error.error.message);
            }
          );
        }
      },
      (error) => {
        this.openVentana(error.error.message);
      }
    );
  }
}
