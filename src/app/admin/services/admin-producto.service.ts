import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductoService {

  private url= 'http://localhost:3000/api/productos'

  constructor(private http: HttpClient) { }

  getProducts():Observable<Producto[]>{
    return this.http.get<Producto[]>(this.url)
  }
   getById(id:string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }
  
//===========CRUD===================
  createProduct(data: FormData): Observable<Producto> {
  return this.http.post<Producto>(this.url, data);
}

updateProduct(id: string, data: any): Observable<Producto> {
  return this.http.put<Producto>(`${this.url}/${id}`, data);
}

deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.url}/${id}`);
}
}