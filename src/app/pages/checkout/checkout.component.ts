import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true, // Asegúrate de si es standalone o no según tu proyecto
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  cart: CartItem[] = [];
  confirmado = false;
  loading = true; 
  private cartSub: Subscription | undefined;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private ordenesService: OrdenesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1. ESCUCHA REACTIVA: La vista siempre reflejará lo que diga el servicio
    this.cartSub = this.carritoService.cart$.subscribe(items => {
      this.cart = items;
      console.log('Checkout actualizado:', items);
      
      // Si recibimos items (aunque sea lista vacía), dejamos de cargar
      // Esto quita el "Sincronizando..." del HTML
      this.loading = false; 
    });

    // 2. DISPARO INICIAL
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    // getCart llamará internamente a setCart(), lo que activará el subscribe de arriba
    this.carritoService.getCart().subscribe({
      error: () => this.loading = false // En caso de error de red, liberamos la pantalla
    });
  }

  get total() {
    return this.cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  confirmarCompra() {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.loading) return; 
    this.loading = true;

    // Verificación final antes de crear la orden
    this.carritoService.getCart().subscribe({
      next: (items) => {
        if (!items || items.length === 0) {
          alert('Tu carrito está vacío.');
          this.loading = false;
          return;
        }

        this.ordenesService.createOrder().subscribe({
          next: (orden) => {
            this.confirmado = true;
            localStorage.setItem('lastOrder', JSON.stringify(orden));

            this.carritoService.clearCart().subscribe({
              next: () => {
                this.loading = false;
                this.router.navigate(['/orden', orden.id]);
              },
              error: () => {
                this.loading = false;
                this.router.navigate(['/orden', orden.id]); // Navegamos igual si la orden se creó
              }
            });
          },
          error: (err) => {
            this.loading = false;
            this.manejarError(err);
          }
        });
      },
      error: () => {
        this.loading = false;
        alert('Error de conexión con el servidor');
      }
    });
  }

  private manejarError(err: any) {
    if (err.status === 400) {
      alert(err.error.msg || 'Stock insuficiente');
      this.loadCart();
    } else if (err.status === 401) {
      alert('Sesión expirada');
      this.router.navigate(['/login']);
    } else {
      alert('Error al procesar el pedido');
    }
  }

  ngOnDestroy() {
    // Limpiamos la suscripción para evitar fugas de memoria
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}