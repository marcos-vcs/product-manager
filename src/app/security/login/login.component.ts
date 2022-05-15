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
  loading = false;

  constructor(
    private security: SecurityService,
    private router: Router,
    private snackbar: SnackbarService) { }

  ngOnInit(): void {
  }

  async onSubmit(form: any) {
    this.loading = true;
    if (this.password.length >= 8) {

      await this.security.login(this.email, this.password);

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['']);
      } , 1000);

    } else {
      this.snackbar.openSnackbarAlert('A senha precisa de ter no mínimo 8 caracteres');
      this.loading = false;
    }
  }

}
