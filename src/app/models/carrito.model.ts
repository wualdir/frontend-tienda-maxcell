export interface CartItem {
  id: string;
  modelo: string;
  precio: number;
  cantidad: number;
  imagen: string;
}
export interface CartItemUI extends CartItem {
  stock: number;
}

