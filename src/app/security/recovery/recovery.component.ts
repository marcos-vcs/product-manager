import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {

  email = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    console.log(form);
  }

}
