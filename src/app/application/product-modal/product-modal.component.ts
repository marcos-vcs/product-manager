import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { StorageService } from 'src/app/geral/storage.service';
import { Product } from 'src/app/model/product';
import { SelectModel } from 'src/app/model/select';
import { ProductService } from 'src/app/persistence/product.service';
import { SupplierService } from 'src/app/persistence/supplier.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

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
  updatePhoto: boolean = false;
  public files!: any[];
  fileControl: FormControl;
  maxSize = 3; //mb
  color: ThemePalette = 'primary';
  isPhoto : boolean = true;
  isSave: boolean = false;
  imagePath: any;
  savePhoto = false;
  select!: SelectModel[];
  selected = new FormControl(this.data.product.supplier.code);

  constructor(
    private snackbar: SnackbarService,
    private database: ProductService,
    private getSelect: SupplierService,
    private storage: StorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])
  }

  ngOnInit(): void {
    this.getSelectSupplier();
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.files = [files];
      } else {
        this.files = files;
      }
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

  verifyPhoto(){
    if(this.files[0]){
      this.updatePhoto = true;
    }else{
      this.updatePhoto = false;
    }
  }

  onSubmit(){
    if(this.data.product.name !== undefined &&
       this.data.product.name !== '' ||
       this.data.product.supplier !== undefined &&
       this.data.product.price >= 0 ){
      if (this.data.isNew) {
        this.save();
      }else{
        this.update();
      }
    }else{
      this.snackbar.openSnackbarAlert('Não foi possível salvar o produto, verifique os dados!');
    }
  }

  onDelete(code: string | undefined, url : string | undefined){

    const title = 'Mover para a lixeira';
    const message = 'Deseja realmente mover o produto para a lixeira?';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult && code){

        if(url === undefined){
          url = '';
        }
        this.delete(code, url);
      }else if(!code){
        this.snackbar.openSnackbarAlert('Não foi possível mover o produto para a lixeira, identificador não encontrado!');
      }else{
        this.snackbar.openSnackbarAlert('Operação cancelada!');
      }
    });

  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  private delete(code: string, url: string){
    this.isSave = true;

    if(url === '' || url === null){

      this.database.delete(code).subscribe((response) => {

        try{
          this.storage.delete(url);
        }catch(error){
          console.log(error);
        }

        this.snackbar.openSnackbarSuccess('Produto movido para a lixeira com sucesso!');
        this.dialogRef.close(true);
      }, (error) => {
        console.log(error);
        this.snackbar.openSnackbarAlert("Erro ao mover produto para a lixeira: "+ error.error.message);
      });

    }else{

      try{

        this.database.delete(code).subscribe((response) => {
          this.snackbar.openSnackbarSuccess('Produto movido para a lixeira com sucesso!');
          setTimeout(() => {
            this.dialogRef.close(true);
          } , 1000);
        }, (error) => {

          this.snackbar.openSnackbarAlert("Erro ao deletar produto: " + error.message);
          this.dialogRef.close(true);
        });

      }catch(error){
        this.dialogRef.close(true);
        this.isSave = false;
        this.snackbar.openSnackbarAlert("Erro ao excluir foto!");
      }

    }

  }

  private save(){

    try{
      this.isSave = true;
      this.database.create(this.data.product).subscribe((response) => {
        if(response.response.code){
          this.setPhoto(response.response);
        }
        this.snackbar.openSnackbarSuccess('Produto salvo com sucesso!');

      }, (error) => {
        this.snackbar.openSnackbarAlert("Não foi possível salvar o produto: " + error.status);
        this.dialogRef.close(true);
      });
    }catch(error){
      this.isSave = false;
      this.dialogRef.close(true);
      this.snackbar.openSnackbarAlert("Erro ao salvar produto!");
    }

  }

  private update(){

    try{
      this.isSave = true;
      this.data.product.supplier = this.select.filter(item => item.code === this.selected.value)[0];

      this.database.update(this.data.product).subscribe(
        () => {
          if(this.files  && this.data.product.code ){
            this.setPhoto(this.data.product);
          }
        this.snackbar.openSnackbarSuccess('Produto atualizado com sucesso!');
        this.dialogRef.close(true);
      }, (error) => {
        this.snackbar.openSnackbarAlert(error.message);
        console.log(error);
      });

    }catch(error){
      console.log(error);
      this.snackbar.openSnackbarAlert("Erro ao atualizar produto!");
      this.dialogRef.close(true);
    }

  }

  private async setPhoto(product: Product){
    if(this.imgURL){
      debugger;
      if(!product.code){
        this.snackbar.openSnackbarAlert('Não foi possível salvar a foto, identificador não encontrado!');
        this.dialogRef.close(false);
      }

      (await this.storage.upload(this.files[0], product.code??'')).subscribe((response: any) => {
        if(response === 100){
          this.storage.downloadURL.subscribe((url: string) => {
            product.url = url;
            this.database.update(product).subscribe((response) => {
              this.dialogRef.close(true);
            });
          });
        }
      }, (error: any) => {
        console.log(error);
        this.snackbar.openSnackbarAlert('Não foi possível salvar a foto!');
      });

    }else{
      this.dialogRef.close(true);
    }
  }

  private getSelectSupplier(){
    this.getSelect.getSelect().subscribe(
      (response) => {
        this.select = response.response;
        this.snackbar.openSnackbarSuccess('Fornecedores carregados com sucesso!');
      }, (error) => {
        console.log(error);
        this.snackbar.openSnackbarAlert('Erro ao buscar fornecedores!');
    });
  }

}
