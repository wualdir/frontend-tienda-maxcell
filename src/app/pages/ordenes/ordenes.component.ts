import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core'; // Usamos inject
import { OrdenesService } from '../../services/ordenes.service';
import { Order } from '../../models/ordenes.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  standalone: true, // Asegúrate si es standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent implements OnInit {
  
  ordenes: Order[] = [];
  loading = false;

  // Usar inject es más limpio en Angular moderno
  private orderService = inject(OrdenesService);

  ngOnInit() {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.loading = false;
        console.log('Órdenes cargadas:', this.ordenes);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al traer órdenes:', err);
      }
    });
  }
}