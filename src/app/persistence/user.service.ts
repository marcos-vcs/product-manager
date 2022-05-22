import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  verifyUser(token: string): Observable<Response<User>>{
    return this.http.get<Response<User>>(`${environment.api}${environment.user}`,
    {headers: this.getHeaderModifyAuthorization(token)});
  }

  createUser(user: User):  Observable<Response<User>>{
    return this.http.post<Response<User>>(`${environment.api}${environment.user}`, user);
  }

  private getHeader(): HttpHeaders{
    const token = localStorage.getItem('Authorization');
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type','application/json; charset=utf-8');
    return headers;
  }

  private getHeaderModifyAuthorization(token: string): HttpHeaders{
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type','application/json; charset=utf-8');
    return headers;
  }

}
