import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoUrlService {

  photoUrl = new BehaviorSubject('');
  deleteState = new BehaviorSubject(false);

  constructor() { }
}
