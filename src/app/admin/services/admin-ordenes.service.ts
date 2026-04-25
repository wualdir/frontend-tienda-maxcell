import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/ordenes.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // 👈 Importamos environment

@Injectable({
  providedIn: 'root'
})
export class AdminOrdenesService {

  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) {}

  // 📦 todas las órdenes (admin)
  getAllOrders(): Observable<Order[]> {
    // Apuntará a /api/ordenes/admin en Local o Render
    return this.http.get<Order[]>(`${this.url}/admin`);
  }

  // 👤 órdenes por usuario
  getOrdersByUser(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/user/${id}`);
  }

  // 🧾 detalle de orden
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }
}