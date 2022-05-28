import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../model/product';
import { Response } from '../model/response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  create(product: Product): Observable<Response<Product>> {
    return this.http.post<Response<Product>>(
      `${environment.api}${environment.product}`,
      product,
      { headers: this.getHeader() }
    );
  }

  update(product: Product): Observable<Response<Product>> {
    return this.http.put<Response<Product>>(
      `${environment.api}${environment.product}`,
      product,
      { headers: this.getHeader() }
    );
  }

  delete(code: string): Observable<Response<string>> {
    return this.http.delete<Response<string>>(
      `${environment.api}${environment.product}?code=${code}`,
      { headers: this.getHeader() }
    );
  }

  get(skip: number, limit: Number): Observable<Response<Product[]>> {
    return this.http.get<Response<Product[]>>(
      `${environment.api}${environment.product}?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  search(
    skip: number,
    limit: number,
    filter: string,
    search: string
  ): Observable<Response<Product[]>> {
    return this.http.get<Response<Product[]>>(
      `${environment.api}${environment.product}/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`,
      { headers: this.getHeader() }
    );
  }

  getTrash(skip: number, limit: Number): Observable<Response<Product[]>> {
    return this.http.get<Response<Product[]>>(
      `${environment.api}${environment.product}/trash?skip=${skip}&limit=${limit}`,
      { headers: this.getHeader() }
    );
  }

  searchTrash(
    skip: number,
    limit: number,
    filter: string,
    search: string
  ): Observable<Response<Product[]>> {
    return this.http.get<Response<Product[]>>(
      `${environment.api}${environment.product}/trash/search?skip=${skip}&limit=${limit}&filter=${filter}&search=${search}`,
      { headers: this.getHeader() }
    );
  }

  deleteTrash(code?: string): Observable<Response<number>> {
    return this.http.delete<Response<number>>(
      `${environment.api}${environment.product}/trash?code=${code}`,
      { headers: this.getHeader() }
    );
  }



  private getHeader(): HttpHeaders {
    const token = localStorage.getItem('Authorization');
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }
}
