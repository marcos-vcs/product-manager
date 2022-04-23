import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  name = '';
  email = '';
  password1 = '';
  password2 = '';

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    if(this.verifyPassword()) {
      console.log(form);
    }
  }

  verifyPassword(): boolean {
    if (this.password1 === this.password2) {
      return true;
    } else {
      return false;
    }
  }

}
