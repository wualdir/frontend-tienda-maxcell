import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Producto } from '../../models/product.model';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment'; // 👈 Ajusta la ruta de importación si es necesario

@Injectable({
  providedIn: 'root'
})
export class AdminProductoService {
  private http = inject(HttpClient);
  // 1. Usamos la URL dinámica
  private url = `${environment.apiUrl}/productos`;

  // ======= Estado Reactivo (Fuente de verdad para el Admin) =======
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // ======= Métodos de Carga =======
  obtenerProductos(){
    this.loadingSubject.next(true);
   this.http.get<Producto[]>(this.url).pipe(finalize(()=>this.loadingSubject.next(false))
  ).subscribe(data=>(this.productosSubject.next(data)))
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }
  
  // ======= CRUD con Auto-Refresco =======

  createProduct(data: FormData): Observable<Producto> {
    // Al usar FormData (para imágenes), el Interceptor se encargará del token
    return this.http.post<Producto>(this.url, data).pipe(
      // Al crear, refrescamos la lista automáticamente
      tap(()=>this.obtenerProductos()));
  }

  updateProduct(id: string, data: any): Observable<Producto> {
    // Si envías imágenes, usas FormData; si es solo texto, JSON. 
    // El interceptor ya maneja esto.

    return this.http.put<Producto>(`${this.url}/${id}`, data).pipe(
      // Al crear, refrescamos la lista automáticamente
      tap(()=>this.obtenerProductos()));;
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.obtenerProductos())
    );
  }
}