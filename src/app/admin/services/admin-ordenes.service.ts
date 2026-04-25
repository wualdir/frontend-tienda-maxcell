import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/ordenes.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdenesService {

  private url = 'http://localhost:3000/api/ordenes';

  constructor(private http: HttpClient) {}

  // 📦 todas las órdenes (admin)
  getAllOrders() {
    return this.http.get<Order[]>(`${this.url}/admin`);
  }

  // 👤 órdenes por usuario
  getOrdersByUser(id: string) {
    return this.http.get<Order[]>(`${this.url}/user/${id}`);
  }

  // 🧾 detalle de orden
  getOrderById(id: string) {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

 
}
