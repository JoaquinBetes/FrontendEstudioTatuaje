import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Turno } from '../interfaces.js';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';

/**
 * @title Dialog elements
 */

@Component({
  selector: 'ventana-dialog',
  templateUrl: 'ventanaDialog.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatSelectModule,FormsModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ventanaDialog {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ventanaDialog>);
  private router = inject(Router); // Inyecta el Router aquí
  turno: Turno|null = null;

  esEncargado = (sessionStorage.getItem('encargado') == 'true') ? true : false;
  esSucursal = (sessionStorage.getItem('sucursal') == 'true') ? true : false;
  esPoliticas = (sessionStorage.getItem('politicas') == 'true') ? true : false;
  esLiquidacion = (sessionStorage.getItem('liquidacion') == 'true') ? true : false;

  closeDialog() {
    // Aquí rediriges al cerrar el diálogo
    this.dialogRef.close();
    this.router.navigate(['/encargado-tatuadores']);
  }
  closeSucursal() {
    // Aquí rediriges al cerrar el diálogo
    this.dialogRef.close();
    this.router.navigate(['/home-encargado']);
  }
}



@Component({
  selector: 'ventana-dialog-turno',
  templateUrl: 'ventanaDialogTurno.component.html',
  styleUrl: './ventana.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatFormFieldModule, MatOptionModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ventanaDialogTurno {
  data = inject(MAT_DIALOG_DATA);
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<ventanaDialog>);
  turno: Turno|null = null;
  selectedValue: string = "";
  opciones: string[];
  isDisabled: boolean = false;

  constructor(){
    console.log(this.turno)
    const tatuador=sessionStorage.getItem("tatuador")
    if (tatuador === 'true'){
      this.opciones = ["Confirmar", "Cancelar"]
      this.isDisabled = tatuador && this.data?.turno?.estado === "can";
    }
    else{
      this.opciones = ["Cancelar"]
    }
  }
  closeDialog() {
    // Aquí rediriges al cerrar el diálogo
    this.dialogRef.close();
  }
  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }

  aceptar() {
    let estado;
    if (this.selectedValue === "Confirmar"){
       estado ="con" 
       this.http.put<any>(`http://localhost:3000/api/turno/${this.data.turno.id}`,{"estado": estado}).subscribe(
        (response: any) => { 
          this.openVentana(`El turno fue confirmado`);
          this.dialogRef.close();
        },
        (error:any) => {
          console.error('Error', error);
        });
    }
    if (this.selectedValue === "Cancelar"){
      this.http.put<any>(`http://localhost:3000/api/disenio/${this.data.turno.diseño.id}`,{"estado":"dis"}).subscribe(
        (response: any) => {
          this.http.delete<any>(`http://localhost:3000/api/turno/${this.data.turno.id}`).subscribe(
          (response: any) => {
            this.openVentana(`El turno fue cancelado`);
            this.dialogRef.close();
          },
          (error:any) => {
            console.error('Error', error);
          });
          this.cdr.detectChanges();
        }
      );
    }
  }
}

@Component({
  selector: 'ventana-dialog-informe',
  templateUrl: 'ventanaDialogInformes.html',
  styleUrl: './ventana.component.scss',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatFormFieldModule, MatOptionModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ventanaDialogInforme {
  private router = inject(Router); // Inyecta el Router aquí
  dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<ventanaDialog>);
  isDisabled: boolean = false;

  reporteTatuajes():void {
    this.dialogRef.close();
    this.router.navigate(['/encargado-sucursal/informes-tatuadores']);
  }

  reporteIngresos():void {
    this.dialogRef.close();
    this.router.navigate(['/encargado-sucursal/reporte-ingresos']);
  }

}