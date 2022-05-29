import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  downloadURL = new BehaviorSubject('');
  percent = 0;

  constructor(
    private storage: AngularFireStorage
  ) {}

  async upload(event: any, code: string): Promise<Observable<number | undefined>>{

      const file = event;
      const filePath = code;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.downloadURL.next(url);
          });
        })
      ).subscribe();

      return task.percentageChanges();

  }

  async delete(url: string){
    await this.storage.storage.refFromURL(url).delete();
  }


}
