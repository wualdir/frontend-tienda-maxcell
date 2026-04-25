import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Order } from '../models/admin-ordenes.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios (Vista de Admin)
  getUsers(): Observable<User[]> {
    // Apuntará a /api/usuarios en Local o Render
    return this.http.get<User[]>(this.url);
  }

  // Obtener órdenes de un usuario específico
  getOrdersByUser(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.url}/users/${id}/orders`
    );
  }
}