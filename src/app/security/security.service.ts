import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private auth: Auth) { }

  login(email: string, password: string){
    localStorage.setItem('Authorization', `${email} - ${password}`);
  }

  logout(){
    localStorage.removeItem('Authorization');
  }

  createUser(name: string, email: string, password: string){

  }

  resetPassword(){

  }

}
