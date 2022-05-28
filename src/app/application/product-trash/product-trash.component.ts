import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { StorageService } from 'src/app/geral/storage.service';
import { Product } from 'src/app/model/product';
import { Response } from 'src/app/model/response';
import { ProductService } from 'src/app/persistence/product.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductModalComponent } from '../product-modal/product-modal.component';

@Component({
  selector: 'app-product-trash',
  templateUrl: './product-trash.component.html',
  styleUrls: ['./product-trash.component.css']
})
export class ProductTrashComponent implements OnInit {

  skip = 0;
  limit = 20;
  max = 0;
  filter = 'NAME';
  search = '';
  products: Product[] = [];
  notFoundMessage = false;
  loadState = false;
  loadMore = false;

  constructor(
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private database: ProductService,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.get();
  }

  get(){
    this.skip = 0;
    this.limit = 20;
    this.products = [];
    this.notFoundMessage = false;
    this.loadState = true;
    this.max = 0;
    try{
      setTimeout(() => {
        this.database.getTrash(this.skip, this.limit).subscribe(
          (data: Response<Product[]>) => {
            data.response.forEach(element => {
              this.products.push(element);
            });
            this.max = data.quantity;
            console.log(data);

            if(this.products.length === 0){
              this.notFoundMessage = true;
            }
            this.loadState = false;
          },
          (error) => {

            this.loadState = false;

            if(this.products.length === 0){
              this.notFoundMessage = true;
            }

            this.snackbar.openSnackbarAlert("Erro ao carregar produtos: " + error.status);
          }
        );
      }, 1000);
    }catch(error){
      this.loadState = false;
      if(this.products.length === 0){
        this.notFoundMessage = true;
      }
    }

  }

  load(){
    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.getTrash(this.skip, this.limit).subscribe(
        (data: Response<Product[]>) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {

          this.snackbar.openSnackbarAlert(error.message);
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);
  }

  find(){
    this.skip = 0;
    this.limit = 6;
    this.max = 0;
    this.loadState = true;
    this.notFoundMessage = false;
    this.products = [];


    setTimeout(() => {

      if(this.search === ''){
        this.get();
      }else{
        this.database.searchTrash(this.skip, this.limit, this.filter, this.search).subscribe(
          (data: Response<Product[]>) => {
            this.products = [];
            data.response.forEach(element => {
              this.products.push(element);
            });
            this.max = data.quantity;

            if(this.products.length === 0){
              this.notFoundMessage = true;
            }

            this.loadState = false;
          }, (error) => {

            this.snackbar.openSnackbarAlert(error.message);
            console.log(error);
            this.loadState = false;
            this.notFoundMessage = true;
          }
        );
      }

    } , 1000);

  }

  loadFind(){

    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.searchTrash(this.skip, this.limit, this.filter, this.search).subscribe(
        (data: Response<Product[]>) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {

          this.snackbar.openSnackbarAlert(error.message);
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);

  }

  confirmDelete(product: Product){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Apagar produto',
        message: 'Tem certeza que deseja apagar o produto? Esta ação não poderá ser desfeita.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log(product);
      if(result){
        this.delete(product);
      }
    });

  }

  confirmDeleteAll(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Apagar produtos',
        message: 'Tem certeza que deseja apagar todos os produtos? Esta ação não poderá ser desfeita.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteAll(this.products);
      }
    });
  }

  private restore(product: Product){
    this.database.delete(product.code??'').subscribe(
      (data) => {
        this.snackbar.openSnackbarSuccess('Produto apagado com sucesso.');
        this.get();
      },
      (error) => {
        this.snackbar.openSnackbarAlert(error.message);
        console.log(error);
      }
    );
  }

  private restoreAll(products: Product[]){
    products.forEach(e => {
      if(e.code){
        this.database.delete(e.code).subscribe(
          (data) => {
            this.snackbar.openSnackbarSuccess('Produtos apagados com sucesso.');
          },
          (error) => {
            this.snackbar.openSnackbarAlert(error.message);
            console.log(error);
          }
        );
      }
    });

    this.get();
  }

  private delete(product: Product){
    this.loadState = true;
    this.database.deleteTrash(product.code??'').subscribe(
      (data) => {

        try{
          if(product.url != null || product.url != '' || product.url != undefined){
            this.storage.delete(product.url);
          }
        }catch(error){
          this.snackbar.openSnackbarAlert("Erro ao deletar imagem!");
        }

        this.snackbar.openSnackbarSuccess('Produto apagado com sucesso.');
        this.get();
      },
      (error) => {
        this.snackbar.openSnackbarAlert(error.message);
        console.log(error);
      }
    );
  }

  private deleteAll(products: Product[]){
    this.loadState = true;
    this.database.deleteTrash().subscribe(
      (data) => {

        products.forEach(e => {
          try{
            if(e.url != null || e.url != '' || e.url != undefined){
              this.storage.delete(e.url);
            }
          }catch(error){
            this.snackbar.openSnackbarAlert("Erro ao deletar imagem!");
          }
        });

        this.snackbar.openSnackbarSuccess('Produtos apagados com sucesso.');
        this.get();
      },
      (error) => {
        this.snackbar.openSnackbarAlert(error.message);
        console.log(error);
      }
    );
  }

}
