import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SecurityService } from 'src/app/security/security.service';
import { AboutComponent } from '../about/about.component';
import { Product } from 'src/app/model/product';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { RefreshService } from '../product-list/refresh.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  panelOpenState = false;

  constructor(
    private refreshService: RefreshService,
    private observer: BreakpointObserver,
    private router: Router,
    private security: SecurityService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.refreshService.isRefresh.next(true);
  }

  ngAfterViewInit() {

    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  async openAbout(){
    this.dialog.open(AboutComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "90vh"
    });
  }

  logout(){

    const title = 'Tem certeza que deseja sair?';
    const message = 'Você será desconectado do sistema.';
    const dialogData = new ConfirmDialogModel(title, message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.security.logout();
        this.router.navigate(['/login']);
      }
    });

  }

  async createProduct(){
    const product = new Product();
    const dialogRef = this.dialog.open(ProductModalComponent, {
      minWidth: "550px",
      width: "900px",
      maxHeight: "90vh",
      disableClose: true,
      data: {
        product: product,
        isNew: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(!this.refreshService.isRefresh.value){
          this.refreshService.isRefresh.next(true);
        }else{
          this.refreshService.isRefresh.next(false);
        }
      }
    });

  }


}
