import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  isRefreshProduct = new BehaviorSubject(false);
  isRefreshSupplier = new BehaviorSubject(false);
  isRefreshClient = new BehaviorSubject(false);

  constructor() { }
}
