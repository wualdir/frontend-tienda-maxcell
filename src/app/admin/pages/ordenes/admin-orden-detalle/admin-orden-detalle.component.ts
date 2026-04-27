import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminOrdenesService } from '../../../services/admin-ordenes.service';
import { Observable, switchMap,of } from 'rxjs';
import { Order, OrderStatus, OrderUser } from '../../../../models/ordenes.model';

@Component({
  selector: 'app-admin-orden-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orden-detalle.component.html',
  styleUrl: './admin-orden-detalle.component.css'
})
export class AdminOrdenDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AdminOrdenesService);
  private location = inject(Location);

  // 🛡️ Tipado estricto: TypeScript sabrá exactamente qué hay dentro
  orden$!: Observable<Order>;


  // Lista de estados para el combo del HTML
  public readonly estados: OrderStatus[] = ['Pendiente', 'Pagado', 'Enviado', 'Cancelado'];
  public cargandoEstado = false;

// En admin-orden-detalle.component.ts
actualizarEstado(id: string, event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const nuevoEstado = selectElement.value as OrderStatus;
  
  // Si por alguna razón el valor está vacío, no hacemos nada
  if (!nuevoEstado) return;

  this.cargandoEstado = true;

  this.service.actualizarEstadoOrden(id, nuevoEstado).subscribe({
    next: (ordenActualizada) => {
      this.cargandoEstado = false;
      
      // 1. Actualizamos la interfaz (badges, puntos de color, etc)
      this.orden$ = of(ordenActualizada);

      // 2. 🔥 El truco: Resetear el select a la opción "Seleccione..."
      selectElement.value = ""; 
      
      console.log('Estado actualizado y selector reiniciado');
    },
    error: (err) => {
      this.cargandoEstado = false;
      // Si falla, también reseteamos el select para que no mienta sobre el estado real
      selectElement.value = "";
      alert('Error: No se pudo cambiar el estado en el servidor.');
    }
  });
}
  

  ngOnInit(): void {
    this.orden$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        // 🎯 El servicio ya debe devolver Observable<Order>
        return this.service.getOrderById(id);
      })
    );
  }

  /**
   * Helper para formatear el nombre con seguridad de tipos
   * @param user Objeto OrderUser definido en nuestro modelo
   */
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