import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Supplier } from 'src/app/model/supplier';
import { SupplierService } from 'src/app/persistence/supplier.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

export interface DialogData {
  supplier: Supplier;
  isNew: boolean;
}

@Component({
  selector: 'app-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrls: ['./supplier-modal.component.css']
})
export class SupplierModalComponent implements OnInit {

  isSave = false;

  constructor(
    private snackbar: SnackbarService,
    private database: SupplierService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SupplierModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {

  }

  onSubmit(){
    if(this.validation()){
      if(this.data.isNew){
        this.save(this.data.supplier);
      }else{
        this.update(this.data.supplier);
      }
    }
  }

  onDelete(code: string | undefined){

    const title = 'Mover fornecedor para a lixeira';
    const message = 'Deseja realmente mover este fornecedor para a lixeira?';
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

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  private validation(): boolean{

    let email = this.data.supplier.email ?? '';
    let phone = this.data.supplier.phone ?? '';
    let name = this.data.supplier.name ?? '';
    let regEmail  = RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

    if(name.length < 3){
      this.snackbar.openSnackbarAlert("O nome do fornecedor deve ter mais de 3 caracteres");
      return false;
    }
    if(!regEmail.test(email) && email.length > 0){
      this.snackbar.openSnackbarAlert("O e-mail informado é inválido.");
      return false;
    }
    if(phone.length < 11){
      this.snackbar.openSnackbarAlert("O telefone deve ter 11 dígitos");
      return false;
    }

    return true;

  }

  private async update(supplier: Supplier){
    this.isSave = true;
    setTimeout(() => {
      this.database.update(supplier).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Fornecedor alterado com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao alterar fornecedor: " + error.message);
          console.log(error);
          this.onDismiss();
        }
      );
    }, 1000);
  }

  private async save(supplier: Supplier){
    this.isSave = true;
    setTimeout(() => {
      this.database.create(supplier).subscribe(
        (data) => {
          this.snackbar.openSnackbarSuccess('Fornecedor salvo com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao salvar fornecedor: " + error.message);
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
          this.snackbar.openSnackbarSuccess('Fornecedor excluído com sucesso!');
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackbar.openSnackbarAlert("Erro ao excluir fornecedor: " + error.message);
          console.log(error);
          this.onDismiss();
        }
      );
    }, 1000);
  }

}
