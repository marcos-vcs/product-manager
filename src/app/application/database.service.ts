import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';
import { Response } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Response<Product>>{
    return this.http.post<Response<Product>>(`${environment.api}`, product, {headers: this.getHeader()});
  }

  update(product: Product): Observable<Response<Product>>{
    return this.http.put<Response<Product>>(`${environment.api}`, product, {headers: this.getHeader()});
  }

  delete(code: string): Observable<Response<string>>{
    return this.http.delete<Response<string>>(`${environment.api}?code=${code}`, {headers: this.getHeader()});
  }

  get(skip: number, limit: Number): Observable<Response<Product[]>>{
    return this.http.get<Response<Product[]>>(`${environment.api}?skip=${skip}&limit=${limit}`, {headers: this.getHeader()});
  }

  search(skip: number, limit: number, filter: string, search: string): Observable<Response<Product[]>>{
    return this.http.get<Response<Product[]>>(
      `${environment.api}/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`, {headers: this.getHeader()});
  }

  verifyUser(): Observable<Response<User>>{
    return this.http.get<Response<User>>(`${environment.apiUser}`, {headers: this.getHeader()});
  }

  createUser(user: User):  Observable<Response<User>>{
    return this.http.post<Response<User>>(`${environment.apiUser}`, user);
  }

  tokenToUid(): Observable<Response<string>>{
    return this.http.get<Response<string>>(`${environment.apiUser}/token-to-uid`, {headers: this.getHeader()});
  }

  private getHeader(): HttpHeaders{
    const token = localStorage.getItem('Authorization');
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type','application/json; charset=utf-8');
    return headers;
  }



}
