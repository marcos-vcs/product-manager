import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Supplier } from 'src/app/model/supplier';
import { SupplierService } from 'src/app/persistence/supplier.service';

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

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
