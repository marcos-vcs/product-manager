import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DatabaseService } from '../application/database.service';
import { SnackbarService } from '../geral/snackbar.service';
import { Response } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {


  constructor(
    private snackbar: SnackbarService,
    private database: DatabaseService,
    private auth: AngularFireAuth
    ) { }

  login(email: string, password: string){

    this.auth.signInWithEmailAndPassword(email, password).then((response) => {
      localStorage.setItem('Authorization', `${response.user?.getIdToken()}`);
      this.database.verifyUser().subscribe((response: Response<User>) => {

      }, (error) => {
        this.logout();
        console.log(error);
      });
    }, (error) => {
      localStorage.setItem('Authorization', `Error ${error}`);
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

}
