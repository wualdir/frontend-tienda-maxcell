import { Component } from '@angular/core';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';
import { Order } from '../../../../models/ordenes.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common'; // Importa esto

@Component({
  selector: 'app-admin-orden-detalle',
  imports: [CommonModule],
  templateUrl: './admin-orden-detalle.component.html',
  styleUrl: './admin-orden-detalle.component.css'
})
export class AdminOrdenDetalleComponent {
  orden!: Order;

  constructor(
    private route: ActivatedRoute,
    private service: AdminOrdenesService,
    private location:Location
  ) {}

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id')!;

    this.service.getOrderById(id).subscribe({
      next: (data) => this.orden = data,
      error: (err) => console.error(err)
    });
  });
}
volver(){
  this.location.back()
}
}