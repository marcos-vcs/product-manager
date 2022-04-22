import { Routes } from "@angular/router";
import { HomeComponent } from "./application/home/home.component";
import { ProductListComponent } from "./application/product-list/product-list.component";
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
            {path: '', component: ProductListComponent}
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
