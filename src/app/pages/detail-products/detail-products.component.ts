import { Component } from '@angular/core';
import { Producto } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CartItemUI } from '../../models/carrito.model';
import { CloudinaryUrlPipe } from '../pipes/cloudinary.pipe';

@Component({
  selector: 'app-detail-products',
  imports: [CommonModule, RouterLink,CloudinaryUrlPipe],
  templateUrl: './detail-products.component.html',
  styleUrl: './detail-products.component.css'
})
export class DetailProductsComponent {
  producto!: Producto
  cartItem:CartItemUI[]= []
  mensaje = '';

  constructor(
    private productService:ProductService,
    private route:ActivatedRoute,
    private carritoService:CarritoService){}

imagenPrincipal: string = '';
mostrarVideo: boolean = false;

cambiarImagen(url: string) {
  this.imagenPrincipal = url;
  this.mostrarVideo = false;
}

activarVideo() {
  this.mostrarVideo = true;
}

  
// detalle-producto.component.ts
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id')!;
    this.productService.getById(id).subscribe(data => {
      this.producto = data;
      
      // 🔥 LA CLAVE: Asignar la primera foto del array a la vista principal
      if (this.producto.imagenes && this.producto.imagenes.length > 0) {
        this.imagenPrincipal = this.producto.imagenes[0];
      }
    });
  });
}

// Actualizamos el addToCart para usar el nuevo array de imágenes
addToCart(product: Producto) {
  if (product.stock === 0) return;

  const item: CartItemUI = {
    id: product.id,
    modelo: product.modelo,
    precio: product.precio,
    cantidad: 1,
    // Usamos la primera imagen del array para la miniatura del carrito
    imagen: product.imagenes[0], 
    stock: product.stock
  };

  this.carritoService.addToCart(item).subscribe({
    next: () => {
      this.mensaje = '¡Agregado! 🛒';
      setTimeout(() => this.mensaje = '', 2000);
      this.carritoService.openCart();
    }
  });
}
}
