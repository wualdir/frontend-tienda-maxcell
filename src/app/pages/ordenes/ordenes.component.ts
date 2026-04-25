import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrdenesService } from '../../services/ordenes.service';
import { Order } from '../../models/ordenes.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule, RouterLink],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})
export class OrdenesComponent {
 
  ordenes: Order[]= [];

constructor(private orderService: OrdenesService) {}

ngOnInit() {
  this.orderService.getOrders().subscribe(data => {
    this.ordenes = data
  });
}
}

