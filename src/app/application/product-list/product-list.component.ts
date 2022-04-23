import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { Response } from 'src/app/model/response';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  skip = 0;
  limit = 10;
  max = 0;
  filter = 'NAME';
  search = '';
  products: Product[] = [];

  constructor(
    private database: DatabaseService) { }

  ngOnInit(): void {
    this.get();
  }

  get(){
    this.database.get(this.skip, this.limit).subscribe(
      (data: Response) => {
        data.response.forEach(element => {
          this.products.push(element);
          console.log(element);
        });
        this.max = data.quantity;
      },
      error => {
        console.log(error);
      }
    );
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
