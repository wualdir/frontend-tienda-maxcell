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
  this.route.queryParams.subscribe(params => {
    // Sincronización de campos existentes
    this.marca = params['marca'] || '';
    this.minPrecio = params['minPrecio'] ? +params['minPrecio'] : null;
    this.maxPrecio = params['maxPrecio'] ? +params['maxPrecio'] : null;
    this.ram = params['ram'] ? +params['ram'] : null;
    this.almacenamiento = params['almacenamiento'] ? +params['almacenamiento'] : null;
    this.enOferta = params['enOferta'] === 'true';

    // LÓGICA DE PERSISTENCIA PARA STOCK Y PRECIOS:
    if (params['disponible'] === undefined) {
      // 1. Estado inicial o sin filtro de stock: Mostrar todo (incluye agotados)
      this.incluirAgotados = true;
      
      // Enviamos 'all' para que el Backend ignore el filtro de stock
      // y aplique los rangos de precio (usando $gte y $lte en el server)
      const paramsConDefault = { ...params, disponible: 'all' }; 
      this.state.getProductosFiltrados(paramsConDefault);
    } else {
      // 2. Filtro activado por el usuario:
      // Si disponible es 'false', incluirAgotados es true (queremos ver stock 0)
      this.incluirAgotados = params['disponible'] === 'false';
      this.state.getProductosFiltrados(params);
    }
  });
}

  toggleFiltros() {
    this.showFiltros = !this.showFiltros;
  }

aplicarFiltros() {
  const queryParams: any = {
    marca: this.marca || null,
    minPrecio: this.minPrecio ? Number(this.minPrecio) : null,
  maxPrecio: this.maxPrecio ? Number(this.maxPrecio) : null,
    ram: this.ram || null,
    almacenamiento: this.almacenamiento || null,
    enOferta: this.enOferta ? 'true' : null,
  };

  // Si incluirAgotados es true, significa que el usuario activó el switch "Ver agotados"
  // pero queremos que eso actúe como un filtro específico. 
  // Si queremos ver TODO por defecto, podrías manejar un tercer estado o simplemente:
  queryParams.disponible = this.incluirAgotados ? 'all' : 'true';

  this.router.navigate(['/tienda'], { queryParams });
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
  
  // Navegamos a la ruta limpia sin parámetros
  this.router.navigate(['/tienda'], { queryParams: {} });
  this.toggleFiltros();
}
}