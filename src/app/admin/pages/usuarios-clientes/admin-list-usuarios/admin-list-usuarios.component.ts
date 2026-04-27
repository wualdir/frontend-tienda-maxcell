import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Asegúrate que sea RouterModule
import { AdminUsuariosService } from '../../../services/admin-usuarios.service';

@Component({
  selector: 'app-admin-list-usuarios', // Verifica que este selector coincida con tu ruta
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-list-usuarios.component.html',
  styleUrl: './admin-list-usuarios.component.css'
})
export class AdminListUsuariosComponent implements OnInit {
  private usersService = inject(AdminUsuariosService);

  users$ = this.usersService.users$;
  loading$ = this.usersService.loading$;

  ngOnInit() {
    this.usersService.obtenerUsuarios();
  }

  // Sacamos los emojis del HTML para evitar el error de ICU
  getEmojiStatus(active: boolean): string {
    return active ? '🚫' : '✅';
  }

  getRoleIcon(role: string): string {
    return role === 'admin' ? '🛡️' : '👤';
  }

  cambiarEstado(id: string, estadoActual: boolean) {
    const nuevoEstado = !estadoActual;
    if (confirm(nuevoEstado ? '¿Activar usuario?' : '¿Suspender usuario?')) {
      this.usersService.toggleUserStatus(id, nuevoEstado).subscribe();
    }
  }
}