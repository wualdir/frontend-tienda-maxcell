import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs'; // 👈 Añadimos 'take' para obtener el valor actual una sola vez

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private ordenesService = inject(OrdenesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cart$ = this.carritoService.cart$;
  
  total$ = this.cart$.pipe(
    map(items => items.reduce((sum, item) => sum + item.precio * item.cantidad, 0))
  );

  confirmado = false;
  loading = false; 

  ngOnInit() {
    this.loading = true;
    this.carritoService.getCart().subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  confirmarCompra() {
    // 1. Verificación básica de sesión
    const token = !!localStorage.getItem('token'); 
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.loading) return; 

    // 2. Obtenemos los datos actuales del carrito para enviarlos al backend
    // Usamos take(1) para que el observable se complete tras darnos el valor actual
    this.cart$.pipe(take(1)).subscribe(items => {
      
      if (items.length === 0) {
        alert('El carrito está vacío');
        return;
      }

      this.loading = true;

      // 3. Calculamos el total manualmente para el envío
      const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

      // 4. Armamos el paquete de datos (Payload)
      // Ajustamos los nombres de los campos para que coincidan con tu backend (nombre/modelo)
      const datosOrden = {
        items: items.map(i => ({
          id: i.id,
          nombre: i.modelo || i.modelo, // Enviamos el nombre/modelo según tu interfaz
          precio: i.precio,
          cantidad: i.cantidad,
          imagen: i.imagen
        })),
        total: total
      };

      // 5. Enviamos la orden con los datos necesarios
      this.ordenesService.createOrder(datosOrden).subscribe({
        next: (orden) => {
          this.confirmado = true;
          this.carritoService.clearCart().subscribe(() => {
            this.loading = false;
            // Navegamos al detalle de la orden recién creada
            this.router.navigate(['/orden', orden.id]);
          });
        },
        error: (err) => {
          this.loading = false;
          this.manejarError(err);
        }
      });
    });
  }

  private manejarError(err: any) {
    console.error('Detalle del error:', err);
    if (err.status === 400) {
      alert(err.error.msg || 'Error en los datos del pedido');
    } else if (err.status === 401) {
      alert('Sesión expirada');
      this.router.navigate(['/login']);
    } else {
      alert('Error al procesar el pedido: ' + (err.error?.msg || 'Servidor no disponible'));
    }
  }
}