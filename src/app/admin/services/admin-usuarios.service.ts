import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Order } from '../models/admin-ordenes.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {

   private url = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.url);
}

getOrdersByUser(id: string): Observable<Order[]> {
  return this.http.get<Order[]>(
    `${this.url}/users/${id}/orders`
  );
}
}
