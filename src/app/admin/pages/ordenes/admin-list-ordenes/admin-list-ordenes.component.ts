import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';

@Component({
  selector: 'app-admin-list-ordenes',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-list-ordenes.component.html',
  styleUrl: './admin-list-ordenes.component.css'
})
export class AdminListOrdenesComponent implements OnInit {
  // 🚀 Inyección moderna con 'inject'
  private ordersService = inject(AdminOrdenesService);

  // 📺 Conectamos directamente a los flujos del servicio
  // Usar el signo $ al final es una convención para indicar que son Observables
  ordenes$ = this.ordersService.orders$;
  loading$ = this.ordersService.loading$;

  ngOnInit(): void {
    // Solo llamamos a la acción. El componente no "guarda" la data, solo la observa.
    this.ordersService.obtenerTodasLasOrdenes();
  }

  /**
   * Método opcional para refrescar manualmente
   */
  refrescar(): void {
    this.ordersService.obtenerTodasLasOrdenes(true);
  }
}