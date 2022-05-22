import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  private getHeader(): HttpHeaders{
    const token = localStorage.getItem('Authorization');
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type','application/json; charset=utf-8');
    return headers;
  }

}
