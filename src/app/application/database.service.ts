import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';
import { Response, ResponseCreate, ResponseString, ResponseUser } from '../model/response';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<ResponseCreate>{
    return this.http.post<ResponseCreate>(`${environment.api}`, product, {headers: this.getHeader()});
  }

  update(product: Product): Observable<ResponseCreate>{
    return this.http.put<ResponseCreate>(`${environment.api}`, product, {headers: this.getHeader()});
  }

  delete(code: string): Observable<ResponseCreate>{
    return this.http.delete<ResponseCreate>(`${environment.api}?code=${code}`, {headers: this.getHeader()});
  }

  get(skip: number, limit: Number): Observable<Response>{
    return this.http.get<Response>(`${environment.api}?skip=${skip}&limit=${limit}`, {headers: this.getHeader()});
  }

  search(skip: number, limit: number, filter: string, search: string): Observable<Response>{
    return this.http.get<Response>(
      `${environment.api}/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`, {headers: this.getHeader()});
  }

  verifyUser(): Observable<ResponseUser>{
    return this.http.get<ResponseUser>(`${environment.apiUser}`, {headers: this.getHeader()});
  }

  createUser(user: User):  Observable<ResponseUser>{
    return this.http.post<ResponseUser>(`${environment.apiUser}`, user, {headers: this.getHeader()});
  }

  tokenToUid(): Observable<ResponseString>{
    return this.http.get<ResponseString>(`${environment.apiUser}/token-to-uid`, {headers: this.getHeader()});
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
