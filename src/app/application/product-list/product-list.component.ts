import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Product } from 'src/app/model/product';
import { Response } from 'src/app/model/response';
import { SecurityService } from 'src/app/security/security.service';
import { AboutComponent } from '../about/about.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { DatabaseService } from '../database.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { RefreshService } from './refresh.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  skip = 0;
  limit = 6;
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
    private database: DatabaseService,
    private refreshService: RefreshService) { }

  ngOnInit(): void {

    if(localStorage.getItem("Authorization") === null){
      this.router.navigate(['']);
    }

    this.refreshService.isRefresh.subscribe(() => {
      this.get();
    });
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  get(){
    this.skip = 0;
    this.limit = 6;
    this.products = [];
    this.notFoundMessage = false;
    this.loadState = true;
    this.max = 0;
    try{
      setTimeout(() => {
        this.database.get(this.skip, this.limit).subscribe(
          (data: Response<Product[]>) => {
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

            if(error.status === 401){
              this.security.logout();
              this.router.navigate(['']);
            }

            if(this.products.length === 0){
              this.notFoundMessage = true;
            }

            this.snackbar.openSnackbarAlert(error.error.message);
            console.log(error);

            this.loadState = false;

          }
        );
      }, 2000);
    }catch(error){
      this.loadState = false;
      this.snackbar.openSnackbarAlert('Erroao buscar produtos.');
    }

  }

  load(){
    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (data: Response<Product[]>) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {

          if(error.status === 401){
            this.security.logout();
            this.router.navigate(['']);
          }

          this.snackbar.openSnackbarAlert(error.error.message);
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
        this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
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

            if(error.status === 401){
              this.security.logout();
              this.router.navigate(['']);
            }

            this.snackbar.openSnackbarAlert(error.error.message);
            console.log(error);
            this.loadState = false;
            this.notFoundMessage = true;
          }
        );
      }

    } , 2000);

  }

  loadFind(){

    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
        (data: Response<Product[]>) => {
          data.response.forEach(element => {
            this.products.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Produtos carregados com sucesso.');
        },
        (error) => {

          if(error.status === 401){
            this.security.logout();
            this.router.navigate(['']);
          }

          this.snackbar.openSnackbarAlert(error.error.message);
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);

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
