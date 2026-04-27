import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Order } from '../models/admin-ordenes.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsuariosService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/usuarios`;

  // ======= Estado Reactivo =======
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // ======= Métodos =======

  /**
   * Carga la lista global de usuarios y actualiza el flujo users$
   */
  obtenerUsuarios() {
    this.loadingSubject.next(true);
    this.http.get<User[]>(this.url).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: (data) => this.usersSubject.next(data),
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  /**
   * Obtiene las órdenes de un usuario específico
   * Este se mantiene como Observable directo ya que suele ser para una vista de detalle
   */
  getOrdersByUser(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/users/${id}/orders`);
  }

  /**
   * Ejemplo de acción administrativa: Bloquear/Desbloquear usuario
   */
  toggleUserStatus(id: string, active: boolean): Observable<any> {
    return this.http.patch(`${this.url}/${id}`, { active }).pipe(
      tap(() => this.obtenerUsuarios()) // Refresca la lista automáticamente
    );
  }
}