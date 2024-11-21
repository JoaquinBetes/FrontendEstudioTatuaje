import { ChangeDetectionStrategy, Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
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
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-procesotatuaje',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  templateUrl: './procesotatuaje.component.html',
  styleUrl: './procesotatuaje.component.scss' 
})
export class ProcesotatuajeComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: { id: number, descripcion: string }[] = [];  // Almacena id y descripcion
  filteredOptions: { id: number, descripcion: string }[] = [];
  http = inject(HttpClient);
  dialog = inject(MatDialog);
  cdRef = inject(ChangeDetectorRef);

  estados: { label: string, value: string }[] = [
    { label: "Disponible", value: "dis" },
    { label: "Reservado", value: "res" },
    { label: "Tatuado", value: "tat" }
  ];
  estadoLabel: string = '';

  categoriaOpcion: any ={};
  categoria: number = 0;
  tamanio: number = 0;
  colores: string = '';
  imagen: File | null = null;
  estado: string = '';
  precioBase: number = 0;
  descuento: number = 0;
  precioFinal: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ProcesotatuajeComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {
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
        this.categoriaOpcion =this.options.find((categoria: any) => categoria.codigo == data.disenio.categoria.codigo);
        this.categoria = this.categoriaOpcion.codigo
        // Forzamos la detección de cambios para actualizar la vista
        this.cdRef.markForCheck();
        this.filteredOptions = this.options.slice();
      },
      (error) => {
        this.openVentana(error.error.message);
      }
    );
    console.log(data.disenio)
    // Asigna la data a las propiedades locales para que se use en el formulario
    /* this.categoria = data.categoria.codigo; */
    const disenio = data.disenio
    this.tamanio = disenio.tamanioAproximado;
    this.imagen = disenio.imagen
    this.colores = disenio.colores;
    this.precioBase = disenio.precioBase;
    this.descuento = disenio.descuento;
    this.precioFinal = disenio.precioFinal || 0;
    const estadoEncontrado = this.estados.find(e => e.value === disenio.estado);
    if (estadoEncontrado) {
      this.estado = estadoEncontrado.value;
      this.estadoLabel = estadoEncontrado.label;
    }
  }

    // Método para manejar la selección de estado
  onEstadoSelected(selectedValue: string): void {
    // Actualiza estado y estadoLabel cuando se selecciona una opción
    const estadoEncontrado = this.estados.find(e => e.label === selectedValue);

    if (estadoEncontrado) {
      this.estado = estadoEncontrado.value; // Mantén el valor abreviado para el envío al backend
      this.estadoLabel = estadoEncontrado.label; // Muestra el label completo en el campo
    }
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

  clienteAusente():void {
    const formData = new FormData();
    this.estado = "dis"
    formData.append("estado", this.estado);
    this.http.put<any>(`http://localhost:3000/api/disenio/${this.data.disenio.id}`, formData) // Diseño
      .subscribe(
      (response: any) => {
        this.http.get<any>(`http://localhost:3000/api/turno/${this.data.disenio.turno}`) // Busca turno
      .subscribe(
        (response: any) => {
          let turno = response.data
          let cliente = turno.cliente
          cliente.estado++
          this.http.put<any>(`http://localhost:3000/api/cliente/${cliente.dni}`, cliente) // Actualiza turno y cliente
      .subscribe(
          (response: any) => {
            this.http.delete<any>(`http://localhost:3000/api/turno/${turno.id}`)
            .subscribe(
              (response: any) => {
                this.openVentana("Se ha registrado la ausencia del cliente. Turno cancelado, diseño disponible nuevamente y cleiente amonestado ");
                this.dialogRef.close();
              },
              (error) => {
                this.openVentana(error.error.message);
              }
            );
          },
          (error) => {
            this.openVentana(error.error.message);
          }
        );
        },
        (error) => {
          this.openVentana(error.error.message);
        }
      );
      },
      (error) => {
        this.openVentana(error.error.message);
      }
    );
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
/*     if (!this.precioFinal) {
      alert("Por favor ingresa un precio final");
      return;
    } */
    if (this.estado.length < 3) {
      alert("Por favor ingresa un estado valido");
      return;
    }

    const formData = new FormData();
    formData.append("categoria_codigo", this.categoria.toString());
    formData.append("tamanio_aproximado", this.tamanio.toString());
    formData.append("tatuador_dni", sessionStorage.getItem("dniUsuario") || "");
    formData.append("precio_base", this.precioBase.toString());
    formData.append("descuento", this.descuento.toString());
    formData.append("precio_final", this.precioFinal.toString());
    formData.append("estado", this.estado);
    formData.append("colores", this.colores);
   
    if (this.imagen instanceof File) {
      formData.append("imagen", this.imagen, this.imagen.name);
    }
    
    this.http.put<any>(`http://localhost:3000/api/disenio/${this.data.disenio.id}`, formData)
      .subscribe(
        (response: any) => {
          this.openVentana(response.message);
          this.dialogRef.close();
        },
        (error) => {
          this.openVentana(error.error.message);
        }
      );
      }
}

