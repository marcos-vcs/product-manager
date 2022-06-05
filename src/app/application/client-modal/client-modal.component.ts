import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/persistence/client.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

export interface DialogData {
  client: Client;
  isNew: boolean;
}

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.css']
})
export class ClientModalComponent implements OnInit {

  isSave: boolean = false;

  constructor(
    private snackbar: SnackbarService,
    private database: ClientService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ClientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  onSubmit(){
    if(this.validation()){
      if(this.data.isNew){
        this.save(this.data.client);
      }else{
        this.update(this.data.client);
      }
    }
  }

  onDelete(code: string | undefined){

    const title = 'Mover cliente para a lixeira';
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
        this.snackbar.openSnackbarAlert('Não foi possível excluir o cliente, identificador não encontrado!');
      }else{
        this.snackbar.openSnackbarAlert('Operação cancelada!');
      }
    });
  }



  private validation(): boolean{
    if(this.data.client.name == null || this.data.client.name == ''){
      this.snackbar.openSnackbarAlert('Nome do cliente é obrigatório!');
      return false;
    }
    if(this.data.client.address == null || this.data.client.address == ''){
      this.snackbar.openSnackbarAlert('Endereço do cliente é obrigatório!');
      return false;
    }
    return true;
  }

  private async save(client: Client){
    this.isSave = true;
    setTimeout(() => {
      this.database.create(client).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Cliente salvo com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao salvar cliente: " + error.message);
          console.log(error);
          this.onDismiss();
        }
      );
    }, 1000);
  }

  private async update(client: Client){
    this.isSave = true;
    setTimeout(() => {
      this.database.update(client).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Cliente alterado com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao alterar cliente: " + error.message);
          console.log(error);
          this.onDismiss();
        }
      );
    }, 1000);
  }

  private async delete(code: string){
    this.isSave = true;
    setTimeout(() => {
      this.database.delete(code).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Cliente excluído com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao excluir cliente: " + error.message);
          console.log(error);
          this.onDismiss();
        }
      );
    }, 1000);
  }

}
