import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  isRefresh = new BehaviorSubject(false);

  constructor() { }
}
