import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-offline-dialog',
  templateUrl: './offline-dialog.component.html',
  styleUrls: ['./offline-dialog.component.css']
})
export class OfflineDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OfflineDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
