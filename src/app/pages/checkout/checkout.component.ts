import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs';
import { CloudinaryUrlPipe } from '../pipes/cloudinary.pipe';
// 1. Importamos el pipe de Cloudinary 👇

@Component({
  selector: 'app-checkout',
  standalone: true,
  // 2. Agregamos CloudinaryUrlPipe al arreglo de imports 👇
  imports: [CommonModule, CloudinaryUrlPipe], 
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
    const token = !!localStorage.getItem('token'); 
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.loading) return; 

    this.cart$.pipe(take(1)).subscribe(items => {
      if (items.length === 0) {
        alert('El carrito está vacío');
        return;
      }

      this.loading = true;
      const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

      const datosOrden = {
        items: items.map(i => ({
          id: i.id,
          nombre: i.modelo || i.modelo,
          precio: i.precio,
          cantidad: i.cantidad,
          imagen: i.imagen
        })),
        total: total
      };

      this.ordenesService.createOrder(datosOrden).subscribe({
        next: (orden) => {
          this.confirmado = true;
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