import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  email = '';
  loading = false;

  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
  }

  async onSubmit(form: any) {
    this.loading = true;
    const regex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if(regex.test(this.email)) {
      await this.securityService.recoveryPassword(this.email);
      this.loading = false;
    }else{
      this.loading = false;
    }

  }

}
