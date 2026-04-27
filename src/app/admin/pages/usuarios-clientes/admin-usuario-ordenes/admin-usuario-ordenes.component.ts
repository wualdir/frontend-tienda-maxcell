import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/admin-ordenes.model';
import { AdminUsuariosService } from '../../../services/admin-usuarios.service';

@Component({
  selector: 'app-admin-usuario-ordenes',
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-usuario-ordenes.component.html',
  styleUrl: './admin-usuario-ordenes.component.css'
})
export class AdminUsuarioOrdenesComponent {
 ordenes: Order[] = [];
 userId!: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: AdminUsuariosService
  ) {}

  ngOnInit(): void {

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (!id) {
      console.error('❌ ID no encontrado');
      return;
    }

    this.userId = id;

    this.cargarOrdenes(id);
  });
}

  // 📦 cargar órdenes del usuario
  cargarOrdenes(id: string) {

    this.loading = true;

    this.usuarioService.getOrdersByUser(id)
      .subscribe({
        next: (data) => {

          this.ordenes = data; // ✔ ahora es Order[]

          this.loading = false;
        },
        error: (err) => {

          console.error('❌ Error cargando órdenes', err);

          this.loading = false;
        }
      });
  }}