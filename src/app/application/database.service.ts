import { Injectable } from '@angular/core';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  create(product: Product){

  }

  update(product: Product){

  }

  delete(code: string){

  }

  get(skip: number, limit: Number){

  }

  search(skip: number, limit: number, filter: string, search: string){

  }

}
