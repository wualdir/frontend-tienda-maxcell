import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest,LoginResponse, RegisterRequest, RegisterResponse} from '../models/auth.model'
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService } from './carrito.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urllogin= 'http://localhost:3000/api/auth/login'
  private urlregister= 'http://localhost:3000/api/auth/register'
  
  // Lo inicializamos viendo si hay un token en el localStorage
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();
  //behaviorSubject para el usuario
private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
//exponemos el observable
user$ = this.userSubject.asObservable();
//para el rol 
private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient,private carritoService:CarritoService) { }

  login(data:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.urllogin,data)
  }
  //crear usuario
  register(data: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(this.urlregister,data);
}
 // guardar token
  saveToken(token: string,role:string,username:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    // 3. Notificamos que el usuario se logueó
    this.loggedIn.next(true);
    //notificamos que hay usuario
    this.userSubject.next(username)
    //notificamos si hay rol 
    this.roleSubject.next(role)
    
  }
   logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    // 4. ¡Avisamos a todos que ya NO estamos logueados!
    this.loggedIn.next(false);
    //avisamos que no hay usuario
    this.userSubject.next(null)
    //avisamos que no hay rol
    this.roleSubject.next(null)
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

 /* =========================
     🔐 POST LOGIN / REGISTER
  ========================= */
 handlePostAuth(): void {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (localCart.length > 0) {
      this.carritoService.syncCart(localCart).subscribe({
        next: () => {
          localStorage.removeItem('cart');

          this.carritoService.getCart().subscribe(items => {
            this.carritoService.setCart(items);
          });
        }
      });
    } else {
      this.carritoService.getCart().subscribe(items => {
        this.carritoService.setCart(items);
      });
    }
  }
}
