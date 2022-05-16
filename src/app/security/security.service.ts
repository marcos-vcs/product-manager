import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DatabaseService } from '../application/database.service';
import { SnackbarService } from '../geral/snackbar.service';
import { Response } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {


  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private database: DatabaseService,
    private auth: AngularFireAuth
    ) { }

  async login(email: string, password: string){

    await (await this.auth.signInWithEmailAndPassword(email, password)).user?.getIdToken(true).then((token) => {

      this.database.verifyUser(token).subscribe((response: Response<User>) => {
        localStorage.setItem('Authorization', `${token}`);
        this.snackbar.openSnackbarSuccess('Login efetuado com sucesso!');
        this.router.navigate(['']);
      }, (error) => {
        this.snackbar.openSnackbarAlert('Erro ao efetuar login do lado do servidor!');
        console.log(error);
      });
    }, (error) => {
      localStorage.removeItem('Authorization');
      this.snackbar.openSnackbarAlert('Erro ao efetuar login!');
      console.log(error);
    });

  }

  logout(){
    localStorage.removeItem('Authorization');
  }

  public async createUser(name: string, email: string, password: string){
      await this.auth.createUserWithEmailAndPassword(email, password).then((response) => {

        const user = new User();
        user.name = name;
        user.email = email;
        if(response.user){
          user.uid = response.user.uid;
        }

        this.database.createUser(user).subscribe(
          (response: Response<User>) => {

            this.snackbar.openSnackbarSuccess('Usuário criado com sucesso!');

          },(error) => {
            this.snackbar.openSnackbarAlert('Erro ao criar usuário!');
          }
        );

        },
        (error) => {
          this.snackbar.openSnackbarAlert('Erro ao criar usuário!');
        }
      );
  }

  public async recoveryPassword(email: string){
    await this.auth.sendPasswordResetEmail(email).then(() => {
      this.snackbar.openSnackbarSuccess('E-mail enviado com sucesso!');
      this.router.navigate(['']);
    }, (error) => {
      console.log(error);
      this.snackbar.openSnackbarAlert('Erro ao enviar e-mail!');
    });
  }

}
