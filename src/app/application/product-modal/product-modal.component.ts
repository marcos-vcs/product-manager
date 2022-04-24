import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhotoUrlService } from 'src/app/geral/photo-url.service';
import { SnackbarService } from 'src/app/geral/snackbar.service';
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

  public message!: string;
  imgURL: any;
  public files!: any[];
  fileControl: FormControl;
  maxSize = 3; //mb
  color: ThemePalette = 'primary';
  isPhoto : boolean = true;
  isSave: boolean = false;
  imagePath: any;

  constructor(
    private snackbar: SnackbarService,
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

  private async setPhoto(code: string, product: Product){

    const file = this.files[0];
    await this.storage.upload(file, code);
    this.photoUrl.photoUrl.subscribe(url => {
      product.url = url;
      console.log(product);
      this.database.update(product).subscribe(() => {
        setTimeout(() => {
          this.isSave = false;
          this.dialogRef.close(true);
        }, 5000);
      });
    });

  }

  preview() {

    var reader = new FileReader();
    this.imagePath = this.files[0];
    reader.readAsDataURL(this.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  onSubmit(){
    if (this.data.isNew) {
      this.save();
    }else{
      this.update();
    }
  }

  private save(){
    this.isSave = true;
    this.database.create(this.data.product).subscribe((response) => {
      if(response.response.code){
        this.setPhoto(response.response.code, response.response);
      }
      this.snackbar.openSnackbarSuccess('Produto salvo com sucesso!');

    }, (error) => {
      this.snackbar.openSnackbarAlert(error.message);
      console.log(error);
    });
  }

  private update(){
    this.database.update(this.data.product).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
