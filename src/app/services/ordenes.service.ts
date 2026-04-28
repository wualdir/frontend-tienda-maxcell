import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/ordenes.model';
import { environment } from '../../environments/environment'; // 👈 Importamos environment


// Definimos una interfaz rápida para el envío
interface OrderPayload {
  items: any[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/ordenes`;

  constructor(private http: HttpClient) {}

  // 🧾 Crear orden
 // En ordenes.service.ts
createOrder(orderData: OrderPayload): Observable<any> {
  // Ahora orderData ya no será undefined, llevará el {items, total}
  return this.http.post(this.url, orderData);
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