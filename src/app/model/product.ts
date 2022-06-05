import { SelectModel } from "./select";

export class Product{

  code?: string;
  url!: string;
  name!: string;
  description!: string;
  quantity!: number;
  price!: number;
  supplier!: SelectModel;

}
