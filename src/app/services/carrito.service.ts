import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CartItem } from '../models/carrito.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // 1. URL base centralizada
  private url = `${environment.apiUrl}/carrito`; 

  // ======= Estado del Carrito (Fuentes de Verdad) =======
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable(); // Para el Navbar

  private cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cart.asObservable(); // Para la página del carrito

  private cartOpen = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpen.asObservable(); // Para abrir/cerrar el modal

  constructor(private http: HttpClient) {}

  // ======= Ayudantes Privados (Optimización de Código) =======
  
  public getLocalCart(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  private saveLocalCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.setCart(cart); // Actualiza los observables al instante
  }

  // ======= Control Visual =======
  toggleCart() { this.cartOpen.next(!this.cartOpen.value); }
  openCart() { this.cartOpen.next(true); }
  closeCart() { this.cartOpen.next(false); }

  // Actualiza el estado global y el contador
  setCart(items: CartItem[]) {
    this.cart.next(items);
    const total = items.reduce((acc, item) => acc + item.cantidad, 0);
    this.cartCount.next(total);
  }

  // ======= Lógica Principal de Productos =======

  // Obtener el carrito (Iniciador)
  getCart(): Observable<CartItem[]> {
    const isLogged = !!localStorage.getItem('token');
    
    if (!isLogged) {
      const cart = this.getLocalCart();
      this.setCart(cart);
      return of(cart);
    }

    return this.http.get<CartItem[]>(this.url).pipe(
      tap(items => this.setCart(items))
    );
  }

  // Agregar producto
  addToCart(product: CartItem): Observable<any> {
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
      let cart = this.getLocalCart();
      const existe = cart.find(item => item.id === product.id);
      existe ? (existe.cantidad += product.cantidad) : cart.push(product);
      this.saveLocalCart(cart);
      return of(cart);
    }

    return this.http.post<CartItem[]>(this.url, { producto: product }).pipe(
      tap(items => this.setCart(items))
    );
  }

  // Quitar un producto por ID
  removeFromCart(id: string): Observable<any> {
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
      const cart = this.getLocalCart().filter(item => item.id !== id);
      this.saveLocalCart(cart);
      return of(cart);
    }

    return this.http.delete<CartItem[]>(`${this.url}/${id}`).pipe(
      tap(items => this.setCart(items))
    );
  }

  // Cambiar cantidad de un item
  updateCantidad(id: string, cantidad: number): Observable<any> {
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
      let cart = this.getLocalCart();
      const item = cart.find(i => i.id === id);
      if (item) {
        item.cantidad = cantidad;
        this.saveLocalCart(cart);
      }
      return of(cart);
    }

    return this.http.put<CartItem[]>(`${this.url}/${id}`, { cantidad }).pipe(
      tap(items => this.setCart(items))
    );
  }

  // Vaciar todo el carrito
  clearCart(): Observable<any> {
    const isLogged = !!localStorage.getItem('token');
    
    if (!isLogged) {
      localStorage.removeItem('cart');
      this.setCart([]);
      return of({ mensaje: 'Carrito local limpiado' });
    }

    return this.http.delete<CartItem[]>(this.url).pipe(
      tap(() => this.setCart([]))
    );
  }

  // ======= Sincronización Post-Auth =======
  
  syncCart(localCart: CartItem[]): Observable<CartItem[]> {
    return this.http.post<CartItem[]>(`${this.url}/sync`, { items: localCart }).pipe(
      tap(items => {
        this.setCart(items);
        localStorage.removeItem('cart'); // Limpiar local tras subir a DB
      })
    );
  }

  // Helper para obtener token (usado en interceptores o componentes)
  getUserToken(): string {
    return localStorage.getItem('token') || '';
  }
}