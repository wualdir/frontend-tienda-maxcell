import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/ordenes.model';
import { CartItem } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  private url = 'http://localhost:3000/api/ordenes';
  constructor(private http: HttpClient) {}

    // 🧾 crear orden
createOrder(): Observable<any> {
  return this.http.post(this.url, {});
}

  // 📦 mis órdenes
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }

  // 🔍 detalle
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  
}