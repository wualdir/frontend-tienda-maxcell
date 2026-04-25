import { Component } from '@angular/core';
import { Order } from '../../models/ordenes.model';
import { OrdenesService } from '../../services/ordenes.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-ordenes',
  imports: [CommonModule,RouterLink],
  templateUrl: './detalle-ordenes.component.html',
  styleUrl: './detalle-ordenes.component.css'
})
export class DetalleOrdenesComponent {

orden!: Order;
  constructor(
    private route: ActivatedRoute,
    private ordenesService: OrdenesService
  ) {}

 ngOnInit() {
  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    // 🔥 PROTECCIÓN
    if (!id || id === 'undefined') {
      console.log('ID inválido en ruta');
      return;
    }

    this.ordenesService.getOrderById(id).subscribe({
      next: (data) => {
        this.orden = data;
      },
      error: (err) => {
        console.log('Error cargando orden:', err);
      }
    });

  });
}}
