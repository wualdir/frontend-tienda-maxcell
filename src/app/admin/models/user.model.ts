export interface User {
  id: string;
  username: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  active: boolean;
  role: 'user' | 'CodVic';
  createdAt?: string;
}