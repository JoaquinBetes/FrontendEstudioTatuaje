import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
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

/**
 * @title Dialog elements
 */

@Component({
  selector: 'ventana-dialog',
  templateUrl: 'ventanaDialog.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ventanaDialog {
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ventanaDialog>);
  private router = inject(Router); // Inyecta el Router aquí

  esEncargado = (sessionStorage.getItem('encargado') == 'true') ? true : false;

  closeDialog() {
    // Aquí rediriges al cerrar el diálogo
    this.dialogRef.close();
    this.router.navigate(['/encargado-tatuadores']);
  }

  }

