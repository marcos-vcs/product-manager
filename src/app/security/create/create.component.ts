import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/application/database.service';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { User } from 'src/app/model/user';
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
    if(this.verifiyInformations()){
      this.security.createUser(this.name, this.email, this.password1).then(
        () => {
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }else{
      this.snackbar.openSnackbarAlert('Preencha todos os campos corretamente.');
    }
  }

  verifyPassword(): boolean {
    if (this.password1 === this.password2) {
      return true;
    } else {
      return false;
    }
  }

  private verifiyInformations(): boolean {

    const regex = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

    if (this.name === '' ||
        this.email === '' ||
        regex.test(this.email) === false ||
        this.password1 === '' ||
        this.password2 === '') {
      return false;
    } else {
      return true;
    }
  }

}
