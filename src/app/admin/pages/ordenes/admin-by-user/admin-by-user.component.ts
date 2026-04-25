import { Component } from '@angular/core';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';
import { Order } from '../../../models/admin-ordenes.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-by-user',
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-by-user.component.html',
  styleUrl: './admin-by-user.component.css'
})
export class AdminByUserComponent {
  ordenes: Order[] = [];
  user: any;

  constructor(
    private route: ActivatedRoute,
    private service: AdminOrdenesService
  ) {}
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('id')!;

    this.service.getOrdersByUser(userId).subscribe(data => {
      this.ordenes = data;
      this.user = data[0]?.user;
    });
  });
}}

