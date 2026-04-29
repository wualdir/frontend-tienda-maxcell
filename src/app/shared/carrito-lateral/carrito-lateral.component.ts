import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';

import { CarritoService } from '../../services/carrito.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carrito-lateral',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-lateral.component.html',
  styleUrl: './carrito-lateral.component.css'
})
export class CarritoLateralComponent implements OnInit, OnDestroy {
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
    // 1. Escuchar apertura/cierre del drawer
    this.subs.add(
      this.carritoService.cartOpen$.subscribe(open => this.isOpen = open)
    );

    // 2. 🔥 OPTIMIZACIÓN: Combinar datos de Carrito y Productos
    // Usamos combineLatest para que cuando cualquiera de los dos cambie, el carrito se actualice
    this.subs.add(
      combineLatest([
        this.carritoService.cart$,
        this.productService.productos$
      ]).subscribe(([items, products]) => {
        this.cart = items.map(item => {
          const p = products.find(prod => prod.id === item.id);
          return {
            ...item,
            stock: p?.stock ?? 0
          };
        });
      })
    );

    // 3. Carga inicial
    this.carritoService.getCart().subscribe();
  }

  close() {
    this.carritoService.closeCart();
  }

  // NUEVO: Método para vaciar todo el carrito (asociado al botón del HTML)
  clear() {
    if (confirm('🚀 ¿Deseas limpiar todos los productos del carrito?')) {
      this.carritoService.clearCart().subscribe();
    }
  }

  updateCantidad(item: any) {
    if (item.cantidad <= 0) item.cantidad = 1;
    
    // Validación de Stock en tiempo real
    if (item.cantidad > item.stock) {
      item.cantidad = item.stock;
      // Aquí podrías usar un Toast de SweetAlert2 o similar para el estilo Neon
      console.warn('Stock máximo alcanzado');
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
      // Guardamos la intención de ir a checkout tras el login
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