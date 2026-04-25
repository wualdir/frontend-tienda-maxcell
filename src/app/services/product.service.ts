import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // 👈 Importamos environment

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/productos`;

  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private cargado = false;

  constructor(private http: HttpClient) {}

  cargarProductos() {
    if (this.cargado) return;

    this.loadingSubject.next(true);

    // Usa la URL dinámica de Render/Localhost
    this.http.get<Producto[]>(this.url).subscribe(data => {
      this.productosSubject.next(data);
      this.loadingSubject.next(false);
      this.cargado = true;
    });
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  // =========== CRUD ===========
  createProduct(data: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.url, data);
  }

  updateProduct(id: string, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // =========== BÚSQUEDA ===========
  searchProducts(q: string) {
    return this.http.get<Producto[]>(this.url, { params: { q } });
  }

  searchProductsAdvanced(params: any) {
    return this.http.get<Producto[]>(this.url, { params });
  }

  // =========== FILTROS ===========
  getProductosFiltrados(filtros: any) {
    this.loadingSubject.next(true);

    const params: any = {};

    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params[key] = value;
      }
    });

    this.http.get<Producto[]>(this.url, { params })
      .subscribe({
        next: data => {
          this.productosSubject.next(data);
          this.loadingSubject.next(false);
        },
        error: () => {
          this.loadingSubject.next(false);
        }
      });
  }
}