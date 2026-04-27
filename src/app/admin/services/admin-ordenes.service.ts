import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
import { Order, OrderStatus } from '../../models/ordenes.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdenesService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/ordenes`;

  // ======= Estado Reactivo =======
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // ======= Métodos =======

  /**
   * Carga todas las órdenes del sistema
   * @param forceRefresh Si es true, ignora el cache actual
   */
  obtenerTodasLasOrdenes(forceRefresh: boolean = false) {
    // Si ya tenemos datos y no forzamos refresh, no disparamos el loader visual
    if (this.ordersSubject.value.length === 0 || forceRefresh) {
      this.loadingSubject.next(true);
    }

    this.http.get<Order[]>(`${this.url}/CodVic`).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: (data) => this.ordersSubject.next(data),
      error: (err) => console.error('Error cargando órdenes:', err)
    });
  }

 // En admin-ordenes.service.ts
actualizarEstadoOrden(id: string, nuevoEstado: OrderStatus): Observable<Order> {
  return this.http.patch<Order>(`${this.url}/${id}/estado`, { estado: nuevoEstado }).pipe(
    tap((ordenActualizada) => {
      // 1. Si tienes un Subject con la lista de órdenes, actualízalo
      const lista = this.ordersSubject.value;
      const index = lista.findIndex(o => o.id === id);
      if (index !== -1) {
        lista[index] = ordenActualizada;
        this.ordersSubject.next([...lista]); // Emitimos una copia nueva
      }
    })
  );
}

  // Métodos directos para consultas específicas
  getOrdersByUser(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/user/${id}`);
  }

// En admin-ordenes.service.ts
getOrderById(id: string): Observable<Order> {
  // 💡 El <Order> aquí es lo que le dice a TS qué campos existen
  return this.http.get<Order>(`${this.url}/${id}`);
}
}