import { Product } from "./product";
import { User } from "./user";

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

export class ResponseUser {

  quantity!: number;
  response!: User;
  message!: string;

}
export class ResponseString {

  quantity!: number;
  response!: string;
  message!: string;

}
