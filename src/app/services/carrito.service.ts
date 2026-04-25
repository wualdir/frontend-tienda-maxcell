import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CartItem } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private url = 'http://localhost:3000/api/carrito';
  constructor(private http: HttpClient) {}
  //=======carrito para el navbar =======
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  //========= para la lista del carrito 100% actualizado=====
 private cart = new BehaviorSubject<CartItem[]>([]);
 cart$ = this.cart.asObservable();

//para que se abra y se cierre el carrito lateral 
private cartOpen = new BehaviorSubject<boolean>(false);
  cartOpen$ = this.cartOpen.asObservable();

  toggleCart() {
    this.cartOpen.next(!this.cartOpen.value);
  }

  openCart() {
    this.cartOpen.next(true);
  }

  closeCart() {
    this.cartOpen.next(false);
  }



setCart(items: CartItem[]) {
  this.cart.next(items);

  const total = items.reduce((acc, item) => acc + item.cantidad, 0);
  this.cartCount.next(total);
}

  //=====agregar productos al carrito ===============
addToCart(product: CartItem): Observable<any> {
  const isLogged = !!localStorage.getItem('token');
  //======= 🧑 INVITADO ============
  if (!isLogged) {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existe = cart.find(item => item.id === product.id);
    if (existe) {
      existe.cantidad += product.cantidad;
    } else {
      cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    // 🔥 contador
    this.setCart(cart);
    return of(cart);
  }
  // 🔐 LOGUEADO
  return new Observable(observer => {
  this.http.post<CartItem[]>(this.url, { producto: product }).subscribe(items => {
    this.setCart(items); // 🔥 aquí está la magia
    observer.next(items);
    observer.complete();
  });
});
}

//========obtener productos del carrito============
 getCart(): Observable<CartItem[]> {
  const isLogged = !!localStorage.getItem('token');
  
  if (!isLogged) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.setCart(cart); // 🔥 Actualizamos el estado global para invitados
    return of(cart);
  }

  // 🔐 Para logueados, usamos 'tap' para actualizar el BehaviorSubject automáticamente
  return this.http.get<CartItem[]>(this.url).pipe(
    tap(items => this.setCart(items)) 
  );
}

//========remover items del carrito global =============
removeFromCart(id: string): Observable<any> {
  const isLogged = !!localStorage.getItem('token');

  // 🧑 INVITADO
  if (!isLogged) {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    cart = cart.filter(item => item.id !== id);

    localStorage.setItem('cart', JSON.stringify(cart));

     this.setCart(cart);

    return of(cart);
  }

    // 🔐 LOGUEADO
  return new Observable(observer => {
  this.http.delete<CartItem[]>(`${this.url}/${id}`).subscribe(items => {
     this.setCart(items); // 🔥 aquí está la magia
    observer.next(items);
    observer.complete();
  });
});
}

  // ========Limpiar carrito local ========================
 clearCart(): Observable<any> {
  const isLogged = !!localStorage.getItem('token');
  if (!isLogged) {
    localStorage.removeItem('cart');
   // ====actualizar contador global ======
    this.setCart([]); // 🔥 cambio aquí
    return of({ mensaje: 'carrito limpiado' });
  }
  return new Observable(observer => {
  this.http.delete<CartItem[]>(this.url).subscribe(items => {
    this.setCart(items); // 🔥 aquí está la magia
    observer.next(items);
    observer.complete();
  });
});
}

//=======sicronizar carrito de localstorage vs carrito Back ==================
syncCart(localCart: CartItem[]): Observable<any> {
  return this.http.post(`${this.url}/sync`, {
    items: localCart
  });
}

//===sincronizar carrito invitado  y logeado =============
getLocalCartSync(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
  // ===== para la cantidad ==============
 updateCantidad(id: string, cantidad: number): Observable<any> {
  
  //invitado
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
  //par logeados
  return new Observable(observer => {
  this.http.put<CartItem[]>(`${this.url}/${id}`, { cantidad }).subscribe(items => {
   this.setCart(items); // 🔥 aquí está la magia
    observer.next(items);
    observer.complete();
  });
});
}
//==========obtenemos el token del localstorage =============
getUser(): string {
  return localStorage.getItem('token') || '';
}


}
