import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Client } from 'src/app/model/client';
import { Response } from 'src/app/model/response';
import { ClientService } from 'src/app/persistence/client.service';
import { ClientModalComponent } from '../client-modal/client-modal.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { RefreshService } from '../product-list/refresh.service';

const ELEMENT_DATA: Client[] = [];

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  limitValue = 10;
  limit = this.limitValue;
  skip = 0;
  notFoundMessage = false;
  loadState = false;
  loadMore = false;
  search = '';
  max = 0;
  dataSource = new MatTableDataSource<Client>(ELEMENT_DATA);
  displayedColumns: string[] = ['name', 'address', 'actions'];

  constructor(
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private database: ClientService,
    private refreshService: RefreshService
  ) { }

  ngOnInit(): void {
    this.refreshService.isRefreshClient.subscribe(() => {
      this.get();
    });
  }

  get(){
    this.skip = 0;
    this.limit = this.limitValue;
    this.loadState = true;
    setTimeout(() => {
      this.database.get(this.skip, this.limit).subscribe(
        (suppliers: Response<Client[]>) => {
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
        (data: Response<Client[]>) => {
          data.response.forEach(element => {
            this.dataSource.data.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Clientes carregados com sucesso.');
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
        this.database.search(this.skip, this.limit, this.search).subscribe(
          (data: Response<Client[]>) => {

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
      this.database.search(this.skip, this.limit, this.search).subscribe(
        (data: Response<Client[]>) => {
          data.response.forEach(element => {
            this.dataSource.data.push(element);
          });
          this.max = data.quantity;
          this.loadMore = false;
          this.snackbar.openSnackbarSuccess('Clientes carregados com sucesso.');
        },
        (error) => {

          this.snackbar.openSnackbarAlert(error.message);
          console.log(error);
          this.loadMore = false;
        }
      );
    } , 1000);


  }

  update(client: Client){
    const dialogRef = this.dialog.open(ClientModalComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "80vh",
      disableClose: true,
      data: {
        client: client,
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
    const title = 'Mover para a lixeira';
    const message = 'Deseja realmente mover este cliente para a lixeira?';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult && code){
        this.delete(code);
      }else if(!code){
        this.snackbar.openSnackbarAlert('Não foi possível mover o cliente, identificador não encontrado!');
      }else{
        this.snackbar.openSnackbarAlert('Operação cancelada!');
      }
    });
  }

  private async delete(code: string){
    setTimeout(() => {
      this.database.delete(code).subscribe(
        () => {
          this.snackbar.openSnackbarSuccess('Fornecedor movido para a lixeira com sucesso!');
          this.get();
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao mover fornecedor para a lixeira: " + error.message);
          console.log(error);
        }
      );
    }, 1000);
  }

}
