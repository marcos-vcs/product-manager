import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from '../application/database.service';
import { ResponseUser } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {


  constructor(
    private database: DatabaseService,
    private auth: AngularFireAuth
    ) { }

  login(email: string, password: string){

    this.auth.signInWithEmailAndPassword(email, password).then((response) => {
      localStorage.setItem('Authorization', `${response.user?.getIdToken()}`);
      this.database.verifyUser().subscribe((responseUser: ResponseUser) => {

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

  createUser(name: string, email: string, password: string){
    this.auth.createUserWithEmailAndPassword(email, password).then((response) => {

      console.log(response);

    },
    (error) => {
      console.log(error);
    });
  }

  resetPassword(email: string){
    this.auth.sendPasswordResetEmail(email).then((response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    });
  }

}
