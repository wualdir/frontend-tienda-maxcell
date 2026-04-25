import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CartItem } from '../models/carrito.model';
import { environment } from '../../environments/environment'; // 👈 Importamos environment

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // 1. Centralizamos la URL usando la base del environment
  private url = `${environment.apiUrl}/carrito`; 

  constructor(private http: HttpClient) {}

  // ======= Estado del Carrito =======
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cart.asObservable();

  private cartOpen = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpen.asObservable();

  // ======= Control Visual =======
  toggleCart() { this.cartOpen.next(!this.cartOpen.value); }
  openCart() { this.cartOpen.next(true); }
  closeCart() { this.cartOpen.next(false); }

  setCart(items: CartItem[]) {
    this.cart.next(items);
    const total = items.reduce((acc, item) => acc + item.cantidad, 0);
    this.cartCount.next(total);
  }

  // ======= Agregar Productos =======
  addToCart(product: CartItem): Observable<any> {
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
      let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const existe = cart.find(item => item.id === product.id);
      if (existe) {
        existe.cantidad += product.cantidad;
      } else {
        cart.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      this.setCart(cart);
      return of(cart);
    }

    // 🔐 LOGUEADO: Usa la nueva URL dinámica
    return new Observable(observer => {
      this.http.post<CartItem[]>(this.url, { producto: product }).subscribe(items => {
        this.setCart(items);
        observer.next(items);
        observer.complete();
      });
    });
  }

  // ======= Obtener Productos =======
  getCart(): Observable<CartItem[]> {
    const isLogged = !!localStorage.getItem('token');
    
    if (!isLogged) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.setCart(cart);
      return of(cart);
    }

    // 🔐 Logueados: GET a Render/Localhost según el ambiente
    return this.http.get<CartItem[]>(this.url).pipe(
      tap(items => this.setCart(items)) 
    );
  }

  // ======= Remover Items =======
  removeFromCart(id: string): Observable<any> {
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
      let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.setCart(cart);
      return of(cart);
    }

    // 🔐 LOGUEADO: DELETE a la URL dinámica
    return new Observable(observer => {
      this.http.delete<CartItem[]>(`${this.url}/${id}`).subscribe(items => {
        this.setCart(items);
        observer.next(items);
        observer.complete();
      });
    });
  }

  // ======= Limpiar Carrito =======
  clearCart(): Observable<any> {
    const isLogged = !!localStorage.getItem('token');
    if (!isLogged) {
      localStorage.removeItem('cart');
      this.setCart([]);
      return of({ mensaje: 'carrito limpiado' });
    }
    return new Observable(observer => {
      this.http.delete<CartItem[]>(this.url).subscribe(items => {
        this.setCart(items);
        observer.next(items);
        observer.complete();
      });
    });
  }

  // ======= Sincronizar Carrito =======
 syncCart(localCart: CartItem[]): Observable<CartItem[]> { // 👈 Cambia any por CartItem[]
  return this.http.post<CartItem[]>(`${this.url}/sync`, {
    items: localCart
  });
}

  getLocalCartSync(): CartItem[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  // ======= Actualizar Cantidad =======
  updateCantidad(id: string, cantidad: number): Observable<any> {
    const isLogged = !!localStorage.getItem('token');
    if (!isLogged) {
      let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = cart.find(i => i.id === id);
      if (item) {
        item.cantidad = cantidad;
        localStorage.setItem('cart', JSON.stringify(cart));
        this.setCart(cart);
      }
      return of(cart);
    }
    // 🔐 Logueados: PUT dinámico
    return new Observable(observer => {
      this.http.put<CartItem[]>(`${this.url}/${id}`, { cantidad }).subscribe(items => {
        this.setCart(items);
        observer.next(items);
        observer.complete();
      });
    });
  }

  getUser(): string {
    return localStorage.getItem('token') || '';
  }
}