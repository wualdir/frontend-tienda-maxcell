import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // 👈 Ajusta la ruta de importación si es necesario

@Injectable({
  providedIn: 'root'
})
export class AdminProductoService {

  // 1. Usamos la URL dinámica
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }
  
  // =========== CRUD (Admin) ===========

  createProduct(data: FormData): Observable<Producto> {
    // Al usar FormData (para imágenes), el Interceptor se encargará del token
    return this.http.post<Producto>(this.url, data);
  }

  updateProduct(id: string, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}