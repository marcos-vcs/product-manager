import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { RecoveryComponent } from './security/recovery/recovery.component';
import { CreateComponent } from './security/create/create.component';
import { ProductListComponent } from './application/product-list/product-list.component';
import { ProductModalComponent } from './application/product-modal/product-modal.component';
import { ConfirmDialogComponent } from './application/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

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
    BrowserModule,
    FormsModule,
    HttpClientModule,
    [RouterModule.forRoot(rootRouterConfig, {useHash: true})]
  ],
  providers: [
    { provide: APP_BASE_HREF,  useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
