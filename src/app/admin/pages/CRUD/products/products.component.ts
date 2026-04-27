import { Component, inject } from '@angular/core';
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
 private adminService = inject(AdminProductoService);
  
  productos$ = this.adminService.productos$;
  loading$ = this.adminService.loading$;

  ngOnInit() {
    this.adminService.obtenerProductos();
  }


  eliminar(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => console.log('Producto eliminado y lista actualizada'),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }}
}
