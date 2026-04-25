import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

// Modelos e Interfaces
import { Producto } from '../../models/product.model';

// Servicios
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent {
  @Input() productos: Producto[] = [];

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito(producto: Producto, event: Event) {
    // Evitamos que el clic en el botón active el routerLink de la card madre
    event.stopPropagation();

    // Validamos stock antes de procesar
    if (producto.stock > 0) {
      
      // MAPEADO ESTRICTO: Convertimos Producto -> CartItem
      const itemCarrito: CartItem = {
        id: producto.id,
        modelo: producto.modelo,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      };

      this.carritoService.addToCart(itemCarrito).subscribe({
        next: () => {
          // Abrimos el Side Drawer automáticamente
          this.carritoService.openCart();
        },
        error: (err) => {
          console.error('Error al agregar al carrito:', err);
        }
      });
    }
  }
}