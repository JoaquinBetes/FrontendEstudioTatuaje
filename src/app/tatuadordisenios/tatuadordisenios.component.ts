import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderTattoo } from '../shared/header/header.component.js';
import { TattooSection } from '../shared/tattooSection/tattooSection.component.js';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Diseño } from '../shared/interfaces.js';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import { ventanaDialog } from '../shared/ventana/ventana.component';
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
  cdr = inject(ChangeDetectorRef); 
  disenios: Diseño[] = [];

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/disenio`).subscribe(
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

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TatuadorDiseñosDialog {
  readonly dialogRef = inject(MatDialogRef<TatuadorDiseñosDialog>);
  http = inject(HttpClient);
  dialog = inject(MatDialog);

  categoria: number = 0;
  tamanio: number = 0;
  colores: string = '';
  imagen: File | null = null;
  estado: string = '';
  precioBase: number = 0;
  descuento: number = 0;
  precioFinal: number = 0;

  openVentana(e: any) {
    this.dialog.open(ventanaDialog, { data: e });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Verifica si el archivo es de tipo JPG, JPEG, o PNG
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Solo se permiten archivos JPG, JPEG y PNG.');
        return;
      }
  
      // Aquí simplemente guardamos el archivo en lugar de convertirlo a base64
      this.imagen = file;
    }
  }

  guardarDisenio() {
    if (!this.tamanio) {
      alert("Por favor ingresa un tamaño aproximado.");
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

    if (this.imagen) {
      formData.append("imagen", this.imagen, this.imagen.name); // Aquí se agrega el archivo de imagen
    } else {
      alert("Debe seleccionar una imagen.");
      return;
    }

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
}