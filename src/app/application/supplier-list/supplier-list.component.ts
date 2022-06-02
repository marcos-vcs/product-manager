import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Response } from 'src/app/model/response';
import { Supplier } from 'src/app/model/supplier';
import { SupplierService } from 'src/app/persistence/supplier.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { RefreshService } from '../product-list/refresh.service';
import { SupplierModalComponent } from '../supplier-modal/supplier-modal.component';

const ELEMENT_DATA: Supplier[] = [];

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  limitValue = 2;
  limit = this.limitValue;
  skip = 0;
  notFoundMessage = false;
  loadState = false;
  loadMore = false;
  search = '';
  filter = 'NAME';
  max = 0;
  dataSource = new MatTableDataSource<Supplier>(ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'phone', 'email', 'observation', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private database: SupplierService,
    private refreshService: RefreshService
  ) { }

  ngOnInit(): void {
    this.refreshService.isRefreshSupplier.subscribe(() => {
      this.get();
    });
  }

  get(){
    this.dataSource.data = [];
    this.skip = 0;
    this.limit = this.limitValue;
    this.loadState = true;
    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (suppliers: Response<Supplier[]>) => {
          this.dataSource.data = suppliers.response;
          this.max = suppliers.quantity;
          this.loadState = false;
          this.notFoundMessage = this.dataSource.data.length === 0;
        },
        (error: any) => {
          this.loadState = false;
          this.snackbar.openSnackbarAlert(error.error.message);
        }
      );
    } , 1000);
  }

  load(){
    this.skip += this.limit;
    this.loadMore = true;
    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (data: Response<Supplier[]>) => {
          data.response.forEach(element => {
            this.dataSource.data.push(element);
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
    } , 2000);
  }

  find(){

    this.skip = 0;
    this.limit = this.limitValue;
    this.max = 0;
    this.loadState = true;
    this.notFoundMessage = false;

    setTimeout(() => {

      if(this.search === ''){
        this.get();
      }else{
        this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
          (data: Response<Supplier[]>) => {

            this.dataSource.data = [];
            this.dataSource.data = data.response;
            this.max = data.quantity;
            this.notFoundMessage = this.dataSource.data.length === 0;
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
      this.database.search(this.skip, this.limit, this.filter, this.search).subscribe(
        (data: Response<Supplier[]>) => {
          data.response.forEach(element => {
            this.dataSource.data.push(element);
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

  update(supplier: Supplier){
    const dialogRef = this.dialog.open(SupplierModalComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "90vh",
      disableClose: true,
      data: {
        supplier: supplier,
        isNew: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(!this.refreshService.isRefreshSupplier.value){
          this.refreshService.isRefreshSupplier.next(true);
        }else{
          this.refreshService.isRefreshSupplier.next(false);
        }
      }
    });

  }

  deleteVerify(code: string){
    const title = 'Excluir produto';
    const message = 'Deseja realmente excluir o produto?';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult && code){
        this.delete(code);
      }else if(!code){
        this.snackbar.openSnackbarAlert('Não foi possível excluir o produto, identificador não encontrado!');
      }else{
        this.snackbar.openSnackbarAlert('Operação cancelada!');
      }
    });
  }

  setFilterName(){
    this.search = '';
    this.get();
    this.filter = 'NAME';
  }
  setFilterPhone(){
    this.search = '';
    this.get();
    this.filter = 'PHONE';
  }
  setFilterEmail(){
    this.search = '';
    this.get();
    this.filter = 'EMAIL';
  }

  private async delete(code: string){
    setTimeout(() => {
      this.database.delete(code).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Fornecedor excluído com sucesso!');
          this.get();
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao excluir fornecedor: " + error.message);
          console.log(error);
        }
      );
    }, 1000);
  }

}
