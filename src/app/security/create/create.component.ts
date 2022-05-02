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
    private auth: AngularFireAuth,
    private database: DatabaseService,
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
          setTimeout(() => {


            try{
              this.auth.signInWithEmailAndPassword(this.email, this.password1).then((response) => {

              });
            }catch(error){
              this.snackbar.openSnackbarAlert("Erro ao criar usuário");
            }

              this.auth.signInWithEmailAndPassword(this.email, this.password1).then(
                (response) => {
                  if(response.user) {

                    let user = new User();
                    user.name = this.name;
                    user.email = this.email;
                    user.uid = response.user.uid;

                    this.database.createUser(user).subscribe(
                      (responseUser) => {
                        console.log(responseUser);
                        this.security.login(this.email, this.password1);
                        this.router.navigate(['/']);
                      }
                    );
                  }

                  this.snackbar.openSnackbarSuccess('Cadastro realizado com sucesso!');
                }, (error) => {
                  console.log(error);
                  this.snackbar.openSnackbarAlert('Erro ao cadastrar usuário!');
                }
              );
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
