import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackbarAlert(msg: string){
    this._snackBar.open(msg, 'Fechar', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['red-snackbar','login-snackbar']
    });
  }
  openSnackbarSuccess(msg: string){
    this._snackBar.open(msg, 'Fechar', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['green-snackbar','login-snackbar']
    });
  }

}
