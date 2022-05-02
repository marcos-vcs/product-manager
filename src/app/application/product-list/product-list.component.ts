import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Product } from 'src/app/model/product';
import { Response } from 'src/app/model/response';
import { SecurityService } from 'src/app/security/security.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { DatabaseService } from '../database.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  skip = 0;
  limit = 10;
  max = 0;
  filter = 'NAME';
  search = '';
  products: Product[] = [];
  notFoundMessage = false;
  loadState = false;
  loadMore = false;

  constructor(
    private security: SecurityService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private database: DatabaseService) { }

  ngOnInit(): void {
    this.get();
  }

  get(){
    this.skip = 0;
    this.limit = 10;
    this.products = [];
    this.notFoundMessage = false;
    this.loadState = true;
    this.max = 0;

    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (data: Response) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;

          if(this.products.length === 0){
            this.notFoundMessage = true;
          }
          this.loadState = false;
        },
        (error) => {

          if(this.products.length === 0){
            this.notFoundMessage = true;
          }

          this.snackbar.openSnackbarAlert('Servidor não encontrado.');
          console.log(error);

          this.loadState = false;

        }
      );
    }, 1000);
  }

  load(){
    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (data: Response) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {
          this.snackbar.openSnackbarAlert('Não foi possível carregar os produtos.');
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);
  }

  find(){
    this.skip = 0;
    this.limit = 10;
    this.max = 0;
    this.loadState = true;
    this.notFoundMessage = false;
    this.products = [];


    setTimeout(() => {

      if(this.search === ''){
        this.get();
      }else{
        this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
          (data: Response) => {
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
            this.snackbar.openSnackbarAlert('Servidor não encontrado.');
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
      this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
        (data: Response) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {
          this.snackbar.openSnackbarAlert('Não foi possível carregar os produtos.');
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);

  }

  logout(){

    const title = 'Tem certeza que deseja sair?';
    const message = 'Você será desconectado do sistema.';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.security.logout();
        this.router.navigate(['/login']);
      }
    });

  }

  async create(){
    const product = new Product();
    const dialogRef = this.dialog.open(ProductModalComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "90vh",
      disableClose: true,
      data: {
        product: product,
        isNew: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.get();
      }
    });

  }

  async edit(product: Product){
    const dialogRef = this.dialog.open(ProductModalComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "90vh",
      disableClose: true,
      data: {
        product: product,
        isNew: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.get();
      }
    });
  }

  setFilterName(){
    this.search = '';
    this.get();
    this.filter = 'NAME';
  }
  setFilterBrand(){
    this.search = '';
    this.get();
    this.filter = 'BRAND';
  }
  setFilterPrice(){
    this.search = '';
    this.get();
    this.filter = 'PRICE';
  }

}
