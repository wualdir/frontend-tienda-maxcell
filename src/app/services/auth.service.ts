import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model'
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService } from './carrito.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Centralizamos la base. 
  // Si environment.apiUrl es 'https://api-maxcell.onrender.com/api'
  private baseUrl = environment.apiUrl; 

  // --- BORRAMOS las variables locales fijas ---
  
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  user$ = this.userSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private carritoService: CarritoService) { }

  // 2. Adaptamos el Login
  login(data: LoginRequest): Observable<LoginResponse> {
    // Usamos `${this.baseUrl}/auth/login`
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data);
  }

  // 3. Adaptamos el Register
  register(data: RegisterRequest): Observable<RegisterResponse> {
    // Usamos `${this.baseUrl}/auth/register`
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, data);
  }

  // ... El resto del código (saveToken, logout, etc.) se queda igual
  // ya que no usan URLs externas directamente.

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
handlePostAuth(): void {
  const localCart = this.carritoService.getLocalCartSync();
  
  if (localCart.length > 0) {
    this.carritoService.syncCart(localCart).subscribe({
      next: (items) => {
        localStorage.removeItem('cart');
        this.carritoService.setCart(items); // 👈 Forzamos la actualización inmediata
      }
    });
  } else {
    this.carritoService.getCart().subscribe();
  }
}
}