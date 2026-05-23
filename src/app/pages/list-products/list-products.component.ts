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
  imports: [RouterLink, CommonModule, FormsModule, CloudinaryUrlPipe],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent {
  @Input() productos: Producto[] = [];

  constructor(private carritoService: CarritoService) {}

  // ELIMINAMOS ngOnChanges y ordenarProductos(). 
  // El hijo ya no altera el flujo de datos que viene del padre.

  agregarAlCarrito(producto: Producto, event: Event) {
    event.stopPropagation();

    if (producto.stock <= 0) return; // Cláusula de guarda para evitar anidamientos
      
    const itemCarrito: CartItem = {
      id: producto.id,
      modelo: producto.modelo,
      precio: producto.precio,
      imagen: producto.imagenes?.[0] || 'https://via.placeholder.com/300x400',
      cantidad: 1
    };

    this.carritoService.addToCart(itemCarrito).subscribe({
      next: () => this.carritoService.openCart(),
      error: (err) => console.error('Error al agregar al carrito:', err)
    });
  }
}