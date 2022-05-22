import { catchError } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../geral/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedHandlerService implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackbar: SnackbarService
  ) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercepted request ... ');
    console.log(req);
    return next.handle(req).pipe(
      tap(event => {}),
      catchError((err: any) => {
        if (err.status === 401) {
          this.snackbar.openSnackbarAlert('Você não tem permissão para acessar essa página!');
          localStorage.removeItem('Authorization');
          this.router.navigate(['/login']);
        }
        return of(err);
      })
    );
  }

}
