import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/carrito.model';

@Component({
  selector: 'app-carrito-lateral',
  imports: [CommonModule,FormsModule],
  templateUrl: './carrito-lateral.component.html',
  styleUrl: './carrito-lateral.component.css'
})
export class CarritoLateralComponent {
isOpen = false;
  cart: any[] = [];
  private subs: Subscription = new Subscription();

  constructor(
    private carritoService: CarritoService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  // 1. Escuchar apertura/cierre
  this.subs.add(
    this.carritoService.cartOpen$.subscribe(open => this.isOpen = open)
  );

  // 2. 🔥 ÚNICA FUENTE DE VERDAD: Escuchar el canal de datos
  this.subs.add(
    this.carritoService.cart$.subscribe(items => {
      this.enriquecerCarrito(items);
    })
  );

  // 3. Solo disparamos la carga inicial. 
  // getCart ya llama internamente a setCart(), lo que activará la suscripción de arriba.
  this.carritoService.getCart().subscribe();
}
  enriquecerCarrito(items: CartItem[]) {
  // Traemos los productos para sacar el stock real
  this.productService.productos$.subscribe(products => {
    this.cart = items.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return {
        ...item,
        stock: p?.stock ?? 0
      };
    });
  });
}

  loadCart() {
    this.subs.add(
      this.carritoService.getCart().subscribe(items => {
        this.productService.cargarProductos();
        this.productService.productos$.subscribe(products => {
          this.cart = items.map(item => {
            const producto = products.find(p => p.id === item.id);
            return {
              ...item,
              stock: producto?.stock ?? 0
            };
          });
        });
      })
    );
  }

  close() {
    this.carritoService.closeCart();
  }

  updateCantidad(item: any) {
    if (item.cantidad <= 0) item.cantidad = 1;
    if (item.cantidad > item.stock) {
      item.cantidad = item.stock;
      // Podrías cambiar este alert por un toast más elegante después
      alert('⚠️ Stock limitado');
    }
    this.carritoService.updateCantidad(item.id, item.cantidad).subscribe();
  }

  remove(id: string) {
    this.carritoService.removeFromCart(id).subscribe();
  }

  getTotal(): number {
    return this.cart.reduce((t, i) => t + i.precio * i.cantidad, 0);
  }

  checkout() {
    this.close();
    const token = this.authService.getToken();
    if (!token) {
      localStorage.setItem('returnUrl', '/checkout');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/checkout']);
  }

 

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
