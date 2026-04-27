import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Producto } from '../models/product.model';
import { BehaviorSubject, Observable, tap, finalize } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/productos`;

  // ======= Estado Reactivo =======
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private cargado = false;

  // ======= Carga de Datos =======
  cargarProductos(forceRefresh = false) {
    // Si ya cargamos y no pedimos refrescar, no hacemos nada
    if (this.cargado && !forceRefresh) return;

    this.loadingSubject.next(true);
    this.http.get<Producto[]>(this.url).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(data => {
      this.productosSubject.next(data);
      this.cargado = true;
    });
  }

  // ======= Filtros y Búsqueda =======
  getProductosFiltrados(filtros: any) {
    this.loadingSubject.next(true);

    // Limpiamos los parámetros nulos/vacíos
    const params = Object.keys(filtros).reduce((acc: any, key) => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    this.http.get<Producto[]>(this.url, { params }).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(data => this.productosSubject.next(data));
  }

  // ======= Operaciones Atómicas (Devuelven Observable) =======
  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  createProduct(data: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.url, data).pipe(
      tap(() => this.cargarProductos(true)) // Refresca la lista automáticamente
    );
  }

  updateProduct(id: string, data: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, data).pipe(
      tap(() => this.cargarProductos(true))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.cargarProductos(true))
    );
  }
}