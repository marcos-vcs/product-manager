import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private security: SecurityService,
    private router: Router,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    if (this.password.length >= 8) {
      this.snackbar.openSnackbarSuccess('Login efetuado com sucesso!');
      this.security.login(this.email, this.password);
      this.router.navigate(['']);
    } else {
      this.snackbar.openSnackbarAlert('A senha precisa de ter no mínimo 8 caracteres');
    }
  }

}
