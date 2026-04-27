export interface OrderUser {
  id: string;
  username: string;
  role: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
}

export interface OrderItem {
  id: string;      
  nombre: string;  
  imagen: string;  
  precio: number;
  cantidad: number;
}
export type OrderStatus = 'Pendiente' | 'Pagado' | 'Enviado' | 'Cancelado';
export interface Order {
  id: string;
  user: OrderUser; 
  items: OrderItem[]; // 👈 Asegúrate que diga OrderItem y NO CartItem
  total: number;
  estado: OrderStatus;
  createdAt: string;
}