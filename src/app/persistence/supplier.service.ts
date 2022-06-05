import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../model/response';
import { SelectModel } from '../model/select';
import { Supplier } from '../model/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  create(supplier: Supplier): Observable<Response<Supplier>> {
    return this.http.post<Response<Supplier>>(
      `${environment.api}${environment.supplier}`,
      supplier,
      { headers: this.getHeader() }
    );
  }

  update(supplier: Supplier): Observable<Response<Supplier>> {
    return this.http.put<Response<Supplier>>(
      `${environment.api}${environment.supplier}`,
      supplier,
      { headers: this.getHeader() }
    );
  }

  delete(code: string): Observable<Response<string>> {
    return this.http.delete<Response<string>>(
      `${environment.api}${environment.supplier}?code=${code}`,
      { headers: this.getHeader() }
    );
  }

  get(skip: number, limit: Number): Observable<Response<Supplier[]>> {
    return this.http.get<Response<Supplier[]>>(
      `${environment.api}${environment.supplier}?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  getSelect(): Observable<Response<SelectModel[]>> {
    return this.http.get<Response<SelectModel[]>>(
      `${environment.api}${environment.supplier}/select`,
      { headers: this.getHeader() }
    );
  }

  search(
    skip: number,
    limit: number,
    filter: string,
    search: string
  ): Observable<Response<Supplier[]>> {
    return this.http.get<Response<Supplier[]>>(
      `${environment.api}${environment.supplier}/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`,
      { headers: this.getHeader() }
    );
  }

  getTrash(skip: number, limit: Number): Observable<Response<Supplier[]>> {
    return this.http.get<Response<Supplier[]>>(
      `${environment.api}${environment.supplier}/trash?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  searchTrash(
    skip: number,
    limit: number,
    filter: string,
    search: string
  ): Observable<Response<Supplier[]>> {
    return this.http.get<Response<Supplier[]>>(
      `${environment.api}${environment.supplier}/trash/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`,
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

  deleteTrash(code?: string): Observable<Response<number>> {
    return this.http.delete<Response<number>>(
      `${environment.api}${environment.supplier}/trash?code=${code}`,
      { headers: this.getHeader() }
    );
  }


}
