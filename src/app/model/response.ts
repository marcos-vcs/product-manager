import { Product } from "./product";

export class Response {

  quantity!: number;
  response!: Product[];
  message!: string;

}

export class ResponseCreate {

  quantity!: number;
  response!: Product;
  message!: string;

}
