import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  // 1. Inyectamos los servicios (más moderno)
  private carritoService = inject(CarritoService);
  private ordenesService = inject(OrdenesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Observables directos para el HTML
  cart$ = this.carritoService.cart$;
  
  // Calculamos el total reactivamente
  total$ = this.cart$.pipe(
    map(items => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0))
  );

  confirmado = false;
  loading = false; 

  ngOnInit() {
    // Solo disparamos la carga inicial si es necesario
    this.loading = true;
    this.carritoService.getCart().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  confirmarCompra() {
    // Usamos el método del authService que ya tienes
    const token = !!localStorage.getItem('token'); 

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.loading) return; 
    this.loading = true;

    // Crear la orden directamente (el servidor ya sabe qué hay en el carrito por el token)
    this.ordenesService.createOrder().subscribe({
      next: (orden) => {
        this.confirmado = true;
        // Limpiamos el carrito (esto actualizará el Navbar automáticamente)
        this.carritoService.clearCart().subscribe(() => {
          this.loading = false;
          this.router.navigate(['/orden', orden.id]);
        });
      },
      error: (err) => {
        this.loading = false;
        this.manejarError(err);
      }
    });
  }

  private manejarError(err: any) {
    if (err.status === 400) {
      alert(err.error.msg || 'Stock insuficiente');
    } else if (err.status === 401) {
      alert('Sesión expirada');
      this.router.navigate(['/login']);
    } else {
      alert('Error al procesar el pedido');
    }
  }
}