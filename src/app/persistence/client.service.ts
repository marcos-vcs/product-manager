import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../model/client';
import { Response } from '../model/response';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  create(client: Client): Observable<Response<Client>>{
    return this.http.post<Response<Client>>(
      `${environment.api}${environment.client}`,
      client,
      { headers: this.getHeader() }
    );
  }

  update(client: Client): Observable<Response<Client>>{
    return this.http.put<Response<Client>>(
      `${environment.api}${environment.client}`,
      client,
      { headers: this.getHeader() }
    );
  }

  delete(code: string): Observable<Response<Client>>{
    return this.http.delete<Response<Client>>(
      `${environment.api}${environment.client}?code=${code}`,
      { headers: this.getHeader() }
    );
  }

  get(skip: number, limit: number): Observable<Response<Client[]>>{
    return this.http.get<Response<Client[]>>(
      `${environment.api}${environment.client}?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  search(skip: number, limit: number, search: string): Observable<Response<Client[]>>{
    return this.http.get<Response<Client[]>>(
      `${environment.api}${environment.client}/search?skip=${skip}&limit=${limit}&search=${search}`,
      { headers: this.getHeader() }
    );
  }

  getTrash(skip: number, limit: number): Observable<Response<Client[]>>{
    return this.http.get<Response<Client[]>>(
      `${environment.api}${environment.client}/trash?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  searchTrash(skip: number, limit: number, search: string): Observable<Response<Client[]>>{
    return this.http.get<Response<Client[]>>(
      `${environment.api}${environment.client}/trash/search?skip=${skip}&limit=${limit}&search=${search}`,
      { headers: this.getHeader() }
    );
  }

  deleteTrash(code: string): Observable<Response<number>>{
    return this.http.delete<Response<number>>(
      `${environment.api}${environment.client}/trash?code=${code}`,
      { headers: this.getHeader() }
    );
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
