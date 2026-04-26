import { Component } from '@angular/core';
import { Order } from '../../../models/admin-ordenes.model';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-list-ordenes',
  imports: [RouterLink,CommonModule],
  templateUrl: './admin-list-ordenes.component.html',
  styleUrl: './admin-list-ordenes.component.css'
})
export class AdminListOrdenesComponent {
ordenes: Order[] = [];
  loading = true; // 👈 Agregamos loading para el HTML

  constructor(private service: AdminOrdenesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.service.getAllOrders().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.loading = false;
      }
    });
  }
}
