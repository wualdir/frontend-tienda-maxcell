import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListProductsComponent } from "../list-products/list-products.component";
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [ListProductsComponent, AsyncPipe, CommonModule, FormsModule],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit {
  productos$;
  loading$;
  showFiltros = false;

  // Filtros vinculados a ngModel
  marca: string = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;
  ram: number | null = null;
  almacenamiento: number | null = null;
  enOferta: boolean = false;
  incluirAgotados: boolean = false; // Switch de stock

  // Listas para los combos
  marcasDisponibles = ['Samsung', 'APPLE', 'Xiaomi', 'ZTE', 'Honor', 'Logic'];

  constructor(
    private state: ProductService,
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.productos$ = this.state.productos$;
    this.loading$ = this.state.loading$;
  }

  ngOnInit() {
    // Sincronizar filtros con la URL al cargar/recargar
    this.route.queryParams.subscribe(params => {
      this.marca = params['marca'] || '';
      this.minPrecio = params['minPrecio'] ? +params['minPrecio'] : null;
      this.maxPrecio = params['maxPrecio'] ? +params['maxPrecio'] : null;
      this.ram = params['ram'] ? +params['ram'] : null;
      this.almacenamiento = params['almacenamiento'] ? +params['almacenamiento'] : null;
      this.enOferta = params['enOferta'] === 'true';
      this.incluirAgotados = params['disponible'] !== 'true';

      this.state.getProductosFiltrados(params);
    });
  }

  toggleFiltros() {
    this.showFiltros = !this.showFiltros;
  }

  aplicarFiltros() {
    this.router.navigate(['/tienda'], {
      queryParams: {
        marca: this.marca || null,
        minPrecio: this.minPrecio || null,
        maxPrecio: this.maxPrecio || null,
        ram: this.ram || null,
        almacenamiento: this.almacenamiento || null,
        enOferta: this.enOferta ? 'true' : null,
        // Si incluirAgotados es false, mandamos disponible=true a la API
        disponible: this.incluirAgotados ? 'false' : 'true'
      }
    });
    this.toggleFiltros();
  }

  limpiarFiltros() {
    this.marca = '';
    this.minPrecio = null;
    this.maxPrecio = null;
    this.ram = null;
    this.almacenamiento = null;
    this.enOferta = false;
    this.incluirAgotados = false;
    this.aplicarFiltros();
  }
}