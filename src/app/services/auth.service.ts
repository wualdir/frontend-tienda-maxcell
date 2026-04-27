import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model'
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { CarritoService } from './carrito.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Centralizamos la base. 
  private baseUrl = environment.apiUrl; 

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  user$ = this.userSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private carritoService: CarritoService) { }

  // Método para verificar si es Admin (CodVic)
isAdmin(): boolean {
  // Obtenemos el valor directamente del Subject o del localStorage
  return this.roleSubject.value === 'CodVic';
}

// Opcional: Un observable por si quieres reaccionar a cambios de rol en tiempo real
isAdmin$ = this.roleSubject.asObservable().pipe(
  map(role => role === 'CodVic')
);


  // 2. Adaptamos el Login
  login(data: LoginRequest): Observable<LoginResponse> {
    // Usamos `${this.baseUrl}/auth/login`
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data).pipe(
    // 1. Usamos TAP para efectos secundarios (guardar datos)
    tap((res) => {
      // Si la respuesta es exitosa, el servicio se actualiza a sí mismo
      this.saveToken(res.token, res.user.role, res.user.username);
      console.log('Estado de autenticación actualizado automáticamente');
      this.handlePostAuth()
    }),
    // 2. Usamos catchError para manejar fallos de red o de servidor
    catchError((error) => {
      console.error('Error en el login:', error);
      // Aquí podrías disparar una notificación de alerta
      return throwError(() => error);
    })
  );;
  }

 register(data: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, data).pipe(
    tap((res) => {
      // 🚀 AUTOMATIZACIÓN: Si el registro es exitoso, el servicio se auto-loguea
      if (res.token && res.user) {
        this.saveToken(res.token, res.user.role, res.user.username);
        this.handlePostAuth(); 
        console.log('Registro y login automático completado');
      }
    }),
    catchError((error) => {
      console.error('Error en el proceso de registro:', error);
      return throwError(() => error);
    })
  );
}

// ⚠️ ESTE SE QUEDA IGUAL, NO LO BORRES
saveToken(token: string, role: string, username: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('username', username);
  this.loggedIn.next(true);
  this.userSubject.next(username);
  this.roleSubject.next(role);
}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.loggedIn.next(false);
    this.userSubject.next(null);
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // auth.service.ts
// auth.service.ts (Actualiza este método)

handlePostAuth(): void {
  // 1. Usamos el método que lee directamente el arreglo del localStorage
  // Asegúrate de que en el CarritoService diga: public getLocalCart()
  const localCart = this.carritoService.getLocalCart();
  
  if (localCart && localCart.length > 0) {
    // 2. Sincronizamos. 
    // Nota: El 'tap' dentro de syncCart ya se encarga de hacer el setCart([]) 
    // y de limpiar el localStorage si lo configuramos así.
    this.carritoService.syncCart(localCart).subscribe({
      next: () => {
        console.log('Sincronización exitosa post-auth');
      },
      error: (err) => {
        console.error('Error sincronizando, recargando carrito de la nube...', err);
        this.carritoService.getCart().subscribe();
      }
    });
  } else {
    // 3. Si no hay nada local, forzamos la carga desde la nube
    this.carritoService.getCart().subscribe();
  }
}
}