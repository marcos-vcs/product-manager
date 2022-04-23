import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';
import { Response } from '../model/response';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  create(product: Product): Observable<Response>{
    return this.http.post<Response>(`${environment.api}`, product);
  }

  update(product: Product): Observable<Response>{
    return this.http.put<Response>(`${environment.api}`, product);
  }

  delete(code: string): Observable<Response>{
    return this.http.delete<Response>(`${environment.api}?code=${code}`);
  }

  get(skip: number, limit: Number): Observable<Response>{
    return this.http.get<Response>(`${environment.api}?skip=${skip}&limit=${limit}`);
  }

  search(skip: number, limit: number, filter: string, search: string): Observable<Response>{
    return this.http.get<Response>(
      `${environment.api}?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`
    );
  }



}
