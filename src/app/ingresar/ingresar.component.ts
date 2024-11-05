import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {HttpClient} from '@angular/common/http';
import {ventanaDialog} from '../shared/ventana/ventana.component.js';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
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
import { Router } from '@angular/router';
import { ClienteResponse } from '../shared/interfaces.js';


@Component({
  selector: 'app-ingresar-button',
  standalone: true,
  imports: [MatButtonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresar.component.html',
  styleUrl: './ingresar.component.scss'
})
export class IngresarComponent {
  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(IngresarComponentDialog, {
      width: '40%',
      height: '70%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}

@Component({
  selector: 'app-ingreso-dialog',
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
    MatSlideToggleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresarDialog.component.html',
  styleUrl: './ingresar.component.scss'
})
export class IngresarComponentDialog {
  readonly dialogRef = inject(MatDialogRef<IngresarComponentDialog>);
  dialog = inject(MatDialog);

  http = inject(HttpClient)

  tatuador = false;
  

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

  constructor(private router: Router) {
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
    console.log(e)
    this.dialog.open(ventanaDialog,{data: e});
  }
  onToggleChange(event: MatSlideToggleChange) {
    this.tatuador = event.checked;
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
    const dni = Number.parseInt(this.dni)
    if (!this.tatuador){
      this.http.get<ClienteResponse>(`http://localhost:3000/api/cliente/${dni}`).subscribe(
        (response: ClienteResponse) => {
          // Verificar si el email y la contraseña coinciden
          if (response.data.email === this.email.value && response.data.contraseña === this.contrasenia) {
            sessionStorage.removeItem('encargado');
            sessionStorage.setItem('tatuador', JSON.stringify(this.tatuador));
            sessionStorage.setItem('log-in', 'true');
            sessionStorage.setItem('dniUsuario', this.dni);
            this.dialogRef.close(); // Cierra el diálogo después de la verificación exitosa
            this.router.navigate(['/home-cliente']);
        } else {
            // Mostrar un mensaje de error si el email o la contraseña no coinciden
            this.openVentana('El email o la contraseña no coinciden.');
        }
        },
        error => {
            this.openVentana(error.error.message);
        }
      );
    }
    else{
      this.http.get<ClienteResponse>(`http://localhost:3000/api/tatuador/${dni}`).subscribe(
        (response: ClienteResponse) => {
          // Verificar si el email y la contraseña coinciden
          if (response.data.email === this.email.value && response.data.contraseña === this.contrasenia) {
            sessionStorage.removeItem('encargado');
            sessionStorage.setItem('log-in', 'true');
            sessionStorage.setItem('tatuador', JSON.stringify(this.tatuador));
            sessionStorage.setItem('dniUsuario', this.dni);
            this.dialogRef.close(); // Cierra el diálogo después de la verificación exitosa
            this.router.navigate(['/home-tatuador']);
        } else {
            // Mostrar un mensaje de error si el email o la contraseña no coinciden
            this.openVentana('El email o la contraseña no coinciden.');
        }
        },
        error => {
            this.openVentana(error.error.message);
        }
      );
    }

  }
}

