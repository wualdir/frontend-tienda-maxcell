import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/ordenes.model';
import { environment } from '../../environments/environment'; // 👈 Importamos environment

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) {}

  // 🧾 crear orden
  createOrder(): Observable<any> {
    // Ahora apuntará a /api/ordenes en el servidor correcto
    return this.http.post(this.url, {});
  }

  // 📦 mis órdenes
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  // 🔍 detalle
  getOrderById(id: string): Observable<Order> {
    // Combinamos la URL base dinámica con el ID
    return this.http.get<Order>(`${this.url}/${id}`);
  }
}