import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/geral/snackbar.service';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/persistence/client.service';

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

}
