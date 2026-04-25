import { Component } from '@angular/core';
import { Producto } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CartItemUI } from '../../models/carrito.model';

@Component({
  selector: 'app-detail-products',
  imports: [CommonModule, RouterLink],
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
  
  ngOnInit():void{
   this.route.paramMap.subscribe(params => {
   const id = params.get('id')!;
    this.productService.getById(id).subscribe(data => {
    this.producto = data;
  });
});

  }

addToCart(product:Producto ) {

    // 🔥 VALIDACIÓN UX
  if (product.stock === 0) {
    alert('❌ Producto sin stock');
    return;
  }

  const item: CartItemUI = {
    id: product.id,
    modelo: product.modelo,
    precio: product.precio,
    cantidad: 1,
    imagen: product.imagen,
    stock: product.stock // 🔥 CLAVE
  };

 
this.carritoService.addToCart(item).subscribe({
    next: () => {
       this.mensaje = 'Producto agregado 🛒';
      setTimeout(() => this.mensaje = '', 2000);
      this.carritoService.openCart();
    },
    error: (err) =>console.error(err)

  });
}
}
