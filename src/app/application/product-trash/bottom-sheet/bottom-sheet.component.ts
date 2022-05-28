import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { StorageService } from 'src/app/geral/storage.service';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/persistence/product.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private database: ProductService,
    private storage: StorageService,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Product
  ) { }

  ngOnInit(): void {

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
      if(result){
        this.delete(product);
      }
      this._bottomSheetRef.dismiss(true);
    });

  }

  confirmRestore(product: Product){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '90%',
      minWidth: '60%',
      data: {
        title: 'Restaurar produtos',
        message: 'Tem certeza que deseja restaurar o produto?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.restore(product);
      }
      this._bottomSheetRef.dismiss(true);
    });
  }

  private delete(product: Product){
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

      },
      (error) => {
        this.snackbar.openSnackbarAlert(error.message);
      }
    );
  }

  private restore(product: Product){
    this.database.delete(product.code??'').subscribe(
      (data) => {
        this.snackbar.openSnackbarSuccess('Produto restaurado com sucesso.');
      },
      (error) => {
        this.snackbar.openSnackbarAlert(error.message);
      }
    );
  }

}
