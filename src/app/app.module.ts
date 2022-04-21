import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { RecoveryComponent } from './security/recovery/recovery.component';
import { CreateComponent } from './security/create/create.component';
import { ProductListComponent } from './application/product-list/product-list.component';
import { ProductModalComponent } from './application/product-modal/product-modal.component';
import { ConfirmDialogComponent } from './application/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoveryComponent,
    CreateComponent,
    ProductListComponent,
    ProductModalComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
