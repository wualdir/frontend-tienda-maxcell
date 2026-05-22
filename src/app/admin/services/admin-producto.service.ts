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
  
 // ======= CRUD con Auto-Refresco Optimizado =======

createProduct(data: FormData): Observable<Producto> {
  return this.http.post<Producto>(this.url, data).pipe(
    tap((nuevoProducto) => {
      // Agregamos el nuevo producto al inicio de la lista local sin recargar todo
      const productosActuales = this.productosSubject.value;
      this.productosSubject.next([nuevoProducto, ...productosActuales]);
    })
  );
}

updateProduct(id: string, data: any): Observable<Producto> {
  return this.http.put<Producto>(`${this.url}/${id}`, data).pipe(
    tap((productoEditado) => {
      // Buscamos el producto en la lista local y lo reemplazamos con la respuesta del servidor
      const productosActuales = this.productosSubject.value;
      const index = productosActuales.findIndex(p => p.id === id || (p as any)._id === id);
      
      if (index !== -1) {
        productosActuales[index] = productoEditado;
        // Notificamos a todos los componentes que la lista cambió
        this.productosSubject.next([...productosActuales]);
      } else {
        // Si por alguna razón no estaba (raro), recargamos
        this.obtenerProductos();
      }
    })
  );
}

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => this.obtenerProductos())
    );
  }
}