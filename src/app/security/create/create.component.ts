import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  name = '';
  email = '';
  password1 = '';
  password2 = '';

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private security: SecurityService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    if(this.verifyPassword() &&
       this.name.length > 0 &&
       this.email.length > 0 &&
       this.password1.length > 0 &&
       this.password2.length > 0 &&
       this.password1 === this.password2) {
      this.security.createUser(this.name, this.email, this.password1);
      this.snackbar.openSnackbarSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        this.router.navigate(['/login']);
      } , 2000);
    }
  }

  verifyPassword(): boolean {
    if (this.password1 === this.password2) {
      return true;
    } else {
      return false;
    }
  }

}
