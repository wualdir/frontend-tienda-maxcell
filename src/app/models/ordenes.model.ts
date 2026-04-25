import { CartItem } from "./carrito.model";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  user:{
    id: string;
    username: string;
    role: string;
  }
  estado:string;
}

 