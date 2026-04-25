import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cart: CartItem[] = [];
  confirmado = false;
  loading = false; // 👈 Añadimos un estado de carga

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private ordenesService: OrdenesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1. Cargamos el carrito una sola vez al inicio
    this.loadCart();
  }

  loadCart() {
    this.carritoService.getCart().subscribe(data => {
      this.cart = data;
      // Actualizamos el estado global por si acaso
      this.carritoService.setCart(data);
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

    if (this.loading) return; // Evita doble clic
    this.loading = true;

    // 2. Obtenemos la versión más fresca del carrito antes de pagar
    this.carritoService.getCart().subscribe({
      next: (items) => {
        if (!items || items.length === 0) {
          alert('Tu carrito parece estar vacío. Intenta agregar los productos de nuevo.');
          this.loading = false;
          return;
        }

        // 3. Ya no llamamos a syncCart aquí a menos que sea error. 
        // Directamente creamos la orden porque el backend ya debería estar sincronizado 
        // gracias al handlePostAuth del login.
        this.ordenesService.createOrder().subscribe({
          next: (orden) => {
            this.confirmado = true;
            localStorage.setItem('lastOrder', JSON.stringify(orden));

            // 4. Limpiamos y redirigimos
            this.carritoService.clearCart().subscribe(() => {
              this.loading = false;
              this.router.navigate(['/orden', orden.id]);
            });
          },
          error: (err) => {
            this.loading = false;
            console.error('ERROR ORDER:', err);

            if (err.status === 400) {
              alert(err.error.msg || 'Stock insuficiente o error en validación');
              this.loadCart();
            } else if (err.status === 401) {
              alert('Sesión expirada');
              this.router.navigate(['/login']);
            } else {
              alert('No se pudo procesar el pedido. Inténtalo de nuevo.');
            }
          }
        });
      },
      error: () => {
        this.loading = false;
        alert('Error al verificar el carrito');
      }
    });
  }
}