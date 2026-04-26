export interface Order {
  id: string;
  items: {
    modelo: string;
    precio: number;
    cantidad: number;
    imagen: string;
  }[];

  total: number;
  estado: string;
  createdAt: string;

  user?: {
    id: string;
    username: string;
    role: string;
  };
}