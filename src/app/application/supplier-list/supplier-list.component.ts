import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  notFoundMessage = false;
  loadState = false;
  search = '';
  filter = 'NAME';
  max = 10;

  constructor() { }

  ngOnInit(): void {
  }

  get(){

  }

  load(){

  }

  find(){

  }

  loadFind(){

  }

  setFilterName(){
    this.search = '';
    this.get();
    this.filter = 'NAME';
  }
  setFilterPhone(){
    this.search = '';
    this.get();
    this.filter = 'PHONE';
  }
  setFilterEmail(){
    this.search = '';
    this.get();
    this.filter = 'EMAIL';
  }

}
