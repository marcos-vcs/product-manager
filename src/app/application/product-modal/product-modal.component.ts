import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhotoUrlService } from 'src/app/geral/photo-url.service';
import { StorageService } from 'src/app/geral/storage.service';
import { Product } from 'src/app/model/product';
import { DatabaseService } from '../database.service';

export interface DialogData {
  product: Product;
  isNew: boolean;
}

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {

  public files!: any[];
  fileControl: FormControl;
  maxSize = 3; //mb
  color: ThemePalette = 'primary';
  isPhoto : boolean = true;

  constructor(
    private database: DatabaseService,
    private photoUrl: PhotoUrlService,
    private storage: StorageService,
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])
  }

  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
    })
  }

  async setPhoto(){
    this.isPhoto = false;

    const file = this.files[0];
      await this.storage.upload(file, file.name);
      this.photoUrl.photoUrl.subscribe(url => {
      this.data.product.url = url;
    });

    setTimeout(async () => {
      this.isPhoto = true;
    }, 5000);

  }

  private save(): void {

  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
