import { Routes } from "@angular/router";
import { ClientListComponent } from "./application/client-list/client-list.component";
import { ClientTrashComponent } from "./application/client-trash/client-trash.component";
import { HomeComponent } from "./application/home/home.component";
import { ProductListComponent } from "./application/product-list/product-list.component";
import { ProductTrashComponent } from "./application/product-trash/product-trash.component";
import { SupplierListComponent } from "./application/supplier-list/supplier-list.component";
import { SupplierTrashComponent } from "./application/supplier-trash/supplier-trash.component";
import { AuthenticationComponent } from "./security/authentication/authentication.component";
import { CreateComponent } from "./security/create/create.component";
import { LoginComponent } from "./security/login/login.component";
import { RecoveryComponent } from "./security/recovery/recovery.component";
import { SecurityGuard } from "./security/security.guard";

export const rootRouterConfig: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {path: '', redirectTo: 'product-manager', pathMatch: 'full'},
            {path: 'product-manager', component: ProductListComponent},
            {path: 'product-trash', component: ProductTrashComponent},
            {path: 'supplier-manager', component: SupplierListComponent},
            {path: 'supplier-trash', component: SupplierTrashComponent},
            {path: 'client-manager', component: ClientListComponent},
            {path: 'client-trash', component: ClientTrashComponent},
        ],
        canActivate: [SecurityGuard]
    },
    {
      path: '',
      component: AuthenticationComponent,
      children: [
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {path: 'login', component: LoginComponent},
        {path: 'new-user', component: CreateComponent},
        {path: 'forgot-password', component: RecoveryComponent},
      ]
    }
]
