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
  esCliente: boolean = (sessionStorage.getItem('cliente') == 'true') ? true : false;

  constructor(){
    const tatuador=sessionStorage.getItem("tatuador")
    if (tatuador === 'true'){
      this.opciones = ["Confirmar", "Cancelar"]
      this.isDisabled = tatuador && this.data?.turno?.estado === "can";
    }
    else{
      this.opciones = ["Cancelar"]
    }
  }

  esMenosDe24Horas(turnoFecha: string, turnoHora: string): boolean {
    // Combina la fecha y la hora del turno en un solo objeto Date
    const turnoFechaHora = new Date(`${turnoFecha.split('T')[0]}T${turnoHora}`);
    // Obtén la fecha y hora actuales
    const ahora = new Date();
    // Calcula la diferencia en milisegundos
    const diferenciaMs = turnoFechaHora.getTime() - ahora.getTime();
    // Convierte la diferencia a horas
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    // Retorna si está a menos de 24 horas
    return diferenciaHoras > 0 && diferenciaHoras <= 24;
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
          let correo=""
            let persona=""
            if (sessionStorage.getItem("tatuador") === 'true'){
              correo =this.data.turno.cliente.email
              persona = "cliente"
            }
            else{
              correo = this.data.turno.tatuador.email
              persona = "tatuador"
            }
            const mail ={
              email: correo,
              asunto: "Un turno ha sido confirmado",
              mensaje: `El turno de fecha ${this.data.turno.fechaTurno.split('T')[0]} y hora ${this.data.turno.horaInicio} a sido confirmado por el tatuador`
            }
            this.http.post<any>("http://localhost:3000/api/email/enviar-correo", mail).subscribe(
              (response: any) => {
                  this.openVentana(`El turno ha sido confirmado. El ${persona} será informado vía mail.`); // Envía solo el mensaje
                  this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
              },
              error => {
                  this.openVentana(error.error.message);
              }
            );
        },
        (error:any) => {
          console.error('Error', error);
        });
    }
    if (this.selectedValue === "Cancelar"){
      if(this.esMenosDe24Horas(this.data.turno.fechaTurno, this.data.turno.horaInicio) && this.esCliente){
        this.openVentana("No puede cancelar un turno con menos de 24hrs de anticipación");
        this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
      }
      else{
        this.http.put<any>(`http://localhost:3000/api/disenio/${this.data.turno.diseño.id}`,{"estado":"dis"}).subscribe(
          (response: any) => {
            this.http.delete<any>(`http://localhost:3000/api/turno/${this.data.turno.id}`).subscribe(
            (response: any) => {
              let correo=""
              let persona=""
              if (sessionStorage.getItem("tatuador") === 'true'){
                correo =this.data.turno.cliente.email
                persona = "cliente"
              }
              else{
                correo = this.data.turno.tatuador.email
                persona = "tatuador"
  
              }
              const mail ={
                email: correo,
                asunto: "Un turno ha sido cancelado",
                mensaje: `El turno de fecha ${this.data.turno.fechaTurno.split('T')[0]} y hora ${this.data.turno.horaInicio} ha sido cancelado`
              }
              this.http.post<any>("http://localhost:3000/api/email/enviar-correo", mail).subscribe(
                (response: any) => {
                    this.openVentana(`El turno a sido cancelado. El ${persona} será informado vía mail.`); // Envía solo el mensaje
                    this.dialogRef.close(); // Cierra el diálogo después de crear el Turno
                },
                error => {
                    this.openVentana(error.error.message);
                }
              );
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
    this.router.navigate(['/encargado-sucursal/reporte-mes']);
  }

}