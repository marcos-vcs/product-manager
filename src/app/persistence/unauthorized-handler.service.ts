import { catchError } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../geral/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { OfflineDialogComponent } from '../application/offline-dialog/offline-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedHandlerService implements HttpInterceptor {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {}),
      catchError((err: any) => {
        if (err.status === 401) {

          this.snackbar.openSnackbarAlert('Você não tem permissão para acessar essa página!');
          localStorage.removeItem('Authorization');
          this.router.navigate(['/login']);

        }else if(err.status === 0){

          this.dialog.closeAll();
          this.dialog.open(OfflineDialogComponent, {
            minWidth: '70%',
            maxWidth: '90%',
            disableClose: true
          }).afterClosed().subscribe(() => {
            window.location.reload();
          });

        }else{

          this.snackbar.openSnackbarAlert('Não foi possível realizar a operação!');

        }
        return of(err);
      })
    );
  }

}
