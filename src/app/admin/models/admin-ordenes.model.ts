export interface OrderUser {
  id: string;
  username: string;
  role: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
}

// 📦 Definimos exactamente qué campos tiene un producto DENTRO de la orden
export interface OrderItem {
  id: string;      
  nombre: string;  
  imagen: string;  
  precio: number;
  cantidad: number;
}

export interface Order {
  id: string;
  user: OrderUser; 
  items: OrderItem[]; // 👈 Aquí forzamos el uso de OrderItem
  total: number;
  estado: 'Pendiente' | 'Pagado' | 'Enviado' | 'Cancelado';
  createdAt: string;
}