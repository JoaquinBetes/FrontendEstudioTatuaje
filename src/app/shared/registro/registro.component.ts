import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {HttpClient} from '@angular/common/http';
import {ventanaDialog} from '../ventana/ventana.component.js';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {merge}  from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

interface ClienteResponse {
  message: string;
  data: {
    contraseña: string;
    dni: number;
    email: string;
    estado: number;
    nombreCompleto: string;
    telefono: number;
    turnos: any[];
  };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatButtonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(RegistroComponentDialog, {
      width: '50%',
      height: '90%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'app-registro-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,              
    ReactiveFormsModule,       
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registroDialog.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponentDialog {
  readonly dialogRef = inject(MatDialogRef<RegistroComponentDialog>);
  dialog = inject(MatDialog);

  http = inject(HttpClient)

  hide = signal(true);
  dni = '';
  nombreCompleto = '';
  telefono = '';
  contrasenia = '';

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  protected readonly value = signal('');

  protected onInputDni(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  openVentana(e:any) {
    this.dialog.open(ventanaDialog,{data: e});
  }

  register() {
    const clienteData = {
      dni: this.dni,
      nombreCompleto: this.nombreCompleto,
      email: this.email.value,
      telefono: this.telefono,
      estado:0,
      contraseña: this.contrasenia
    };
    this.http.post<ClienteResponse>('http://localhost:3000/api/cliente', clienteData).subscribe(
      (response: ClienteResponse) => {
          this.openVentana(response.message); // Envía solo el mensaje
          this.dialogRef.close(); // Cierra el diálogo después de crear el cliente
      },
      error => {
          this.openVentana(error.error.message);
      }
);
  }
}
