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
  selector: 'app-client-trash',
  templateUrl: './client-trash.component.html',
  styleUrls: ['./client-trash.component.css']
})
export class ClientTrashComponent implements OnInit {

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
    this.get();
  }

  get(){
    this.skip = 0;
    this.limit = this.limitValue;
    this.loadState = true;
    setTimeout(() => {
      this.database.getTrash(this.skip, this.limit).subscribe(
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
      this.database.getTrash(this.skip, this.limit).subscribe(
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
        this.database.searchTrash(this.skip, this.limit, this.search).subscribe(
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
      this.database.searchTrash(this.skip, this.limit, this.search).subscribe(
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

  deleteVerify(code: string){
    const title = 'Excluir cliente';
    const message = 'Deseja realmente excluir definitivamente este cliente?';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult && code){
        this.delete(code);
      }else if(!code){
        this.snackbar.openSnackbarAlert('Não foi possível excluir cliente, identificador não encontrado!');
      }else{
        this.snackbar.openSnackbarAlert('Operação cancelada!');
      }
    });
  }

  confirmRestore(client: Client){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Restaurar cliente',
        message: 'Tem certeza que deseja restaurar este cliente?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restore(client);
      }
    });

  }

  confirmDeleteAll(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Apagar fornecedores',
        message: 'Tem certeza que deseja apagar todos os fornecedores? Esta ação não poderá ser desfeita.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteAll(this.dataSource.data);
      }
    });
  }

  confirmRestoreAll(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Restaurar fornecedores',
        message: 'Tem certeza que deseja restaurar todos os fornecedores?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restoreAll(this.dataSource.data);
      }
    });
  }

  private async delete(code: string){
    setTimeout(() => {
      this.database.deleteTrash(code).subscribe(
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

  private restore(client: Client){
    this.database.delete(client.code).subscribe(
      () => {
        this.snackbar.openSnackbarSuccess('Cliente restaurado com sucesso!');
        this.get();
      },
      (error) => {
        this.snackbar.openSnackbarAlert("Erro ao restaurar cliente: " + error.message);
        console.log(error);
      }
    );
  }

  private restoreAll(clients: Client[]){

    this.loadState = true;

    clients.forEach(e => {
      if(e.code){
        this.database.delete(e.code).subscribe(
          () => {
            this.snackbar.openSnackbarSuccess('Clientes apagados com sucesso.');
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

  private deleteAll(clients: Client[]){
    this.loadState = true;

    clients.forEach(e => {
      this.database.deleteTrash(e.code).subscribe(
        () => {
          this.snackbar.openSnackbarSuccess('Clientes apagados com sucesso.');
        }, (error) => {
          this.snackbar.openSnackbarAlert(error.message);
          console.log(error);
        }
      );
    } );

    this.get();

  }


}
