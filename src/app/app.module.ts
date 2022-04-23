import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { RecoveryComponent } from './security/recovery/recovery.component';
import { CreateComponent } from './security/create/create.component';
import { ProductListComponent } from './application/product-list/product-list.component';
import { ProductModalComponent } from './application/product-modal/product-modal.component';
import { ConfirmDialogComponent } from './application/confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { HomeComponent } from './application/home/home.component';
import { AuthenticationComponent } from './security/authentication/authentication.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularFireModule } from '@angular/fire/compat';
import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoveryComponent,
    CreateComponent,
    ProductListComponent,
    ProductModalComponent,
    ConfirmDialogComponent,
    HomeComponent,
    AuthenticationComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgxMatFileInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NgxMaskModule.forRoot(),
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    [RouterModule.forRoot(rootRouterConfig, {useHash: true})],
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    AngularFireStorageModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: APP_BASE_HREF,  useValue: '/' },
    { provide: BUCKET, useValue: 'gs://product-manager-dbb81.appspot.com' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
