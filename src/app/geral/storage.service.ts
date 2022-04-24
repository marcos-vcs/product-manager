import { compileDeclareComponentFromMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { PhotoUrlService } from './photo-url.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  downloadURL!: Observable<string>;
  percent = 0;

  constructor(
    private photoUrl: PhotoUrlService,
    private storage: AngularFireStorage
  ) {}

  async upload(event: any, code: string){

      const file = event;
      const filePath = code;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      const uploadPercent = task.percentageChanges();

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.photoUrl.photoUrl.next(url);
          });
        })
      ).subscribe();

      uploadPercent.subscribe(percent => {
        if(percent !== null && percent !== undefined){
          this.percent = percent;
        }
      });

  }

  delete(url: string){
    this.storage.storage.refFromURL(url).delete();
    this.photoUrl.deleteState.next(true);
  }


}
