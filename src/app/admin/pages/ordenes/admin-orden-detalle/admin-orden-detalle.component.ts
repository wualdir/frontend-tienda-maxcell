import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';
import { Observable, switchMap, of } from 'rxjs';
import { Order, OrderStatus, OrderUser } from '../../../../models/ordenes.model';
import { CloudinaryUrlPipe } from '../../../../pages/pipes/cloudinary.pipe';
// 1. Importamos tu Pipe

@Component({
  selector: 'app-admin-orden-detalle',
  standalone: true,
  // 2. Lo agregamos a los imports de este componente standalone
  imports: [CommonModule, CloudinaryUrlPipe],
  templateUrl: './admin-orden-detalle.component.html',
  styleUrl: './admin-orden-detalle.component.css'
})
export class AdminOrdenDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AdminOrdenesService);
  private location = inject(Location);

  orden$!: Observable<Order>;

  public readonly estados: OrderStatus[] = ['Pendiente', 'Pagado', 'Enviado', 'Cancelado'];
  public cargandoEstado = false;

  actualizarEstado(id: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value as OrderStatus;
    
    if (!nuevoEstado) return;

    this.cargandoEstado = true;

    this.service.actualizarEstadoOrden(id, nuevoEstado).subscribe({
      next: (ordenActualizada) => {
        this.cargandoEstado = false;
        this.orden$ = of(ordenActualizada);
        selectElement.value = ""; 
        console.log('Estado actualizado y selector reiniciado');
      },
      error: (err) => {
        this.cargandoEstado = false;
        selectElement.value = "";
        alert('Error: No se pudo cambiar el estado en el servidor.');
      }
    });
  }
  

  ngOnInit(): void {
    this.orden$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.service.getOrderById(id);
      })
    );
  }

  getNombreCompleto(user: OrderUser): string {
    if (!user) return 'Usuario desconocido';
    if (user.nombre && user.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    return user.username;
  }

  volver(): void {
    this.location.back();
  }
}