import { Component } from '@angular/core';
import { Producto } from '../../../../models/product.model';
import { AdminProductoService } from '../../../services/admin-producto.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [RouterLink,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
 productos: Producto[] = [];

  constructor(private service: AdminProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.service.getProducts().subscribe(res => {
      this.productos = res;
    });
  }

  eliminar(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      this.service.deleteProduct(id).subscribe(() => {
        // Filtramos el array localmente para no recargar toda la página
        this.productos = this.productos.filter(p => p.id !== id);
      });
    }
  }
}
