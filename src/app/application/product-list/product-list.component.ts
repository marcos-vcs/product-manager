import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  filter = 'NAME';
  search = '';

  constructor(private database: DatabaseService) { }

  ngOnInit(): void {

  }

  setFilterName(){
    this.search = '';
    this.filter = 'NAME';
  }

  setFilterBrand(){
    this.search = '';
    this.filter = 'BRAND';
  }

  setFilterPrice(){
    this.search = '';
    this.filter = 'PRICE';
  }


}
