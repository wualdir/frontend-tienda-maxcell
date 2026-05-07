import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

// Modelos e Interfaces
import { Producto } from '../../models/product.model';

// Servicios
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { CloudinaryUrlPipe } from '../pipes/cloudinary.pipe';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,CloudinaryUrlPipe],
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
        imagen: producto.imagenes[0],
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
  // Dentro de tu clase ListProductsComponent
ngOnChanges() {
  this.ordenarProductos();
}

ordenarProductos() {
  this.productos.sort((a, b) => {
    // 1. Priorizar los que tienen oferta (precioOriginal)
    const tieneOfertaA = a.precioOriginal && a.precioOriginal > a.precio ? 1 : 0;
    const tieneOfertaB = b.precioOriginal && b.precioOriginal > b.precio ? 1 : 0;

    if (tieneOfertaA !== tieneOfertaB) {
      return tieneOfertaB - tieneOfertaA; // Los que tienen oferta van arriba
    }

    // 2. Si ambos tienen oferta, mostrar el que tiene mayor porcentaje de descuento
    if (tieneOfertaA && tieneOfertaB) {
      const descA = (a.precioOriginal! - a.precio) / a.precioOriginal!;
      const descB = (b.precioOriginal! - b.precio) / b.precioOriginal!;
      return descB - descA;
    }

    return 0; // Mantener orden original para el resto
  });

  // Si solo quieres mostrar los 3 mejores después de ordenar:
  // this.productos = this.productos.slice(0, 3);
}

}