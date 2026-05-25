import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Solo lo esencial
  nombre = '';
  username = '';
  password = '';

  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = null;

    // Enviamos solo los 3 campos esenciales que requiere tu lógica
    const data: any = { 
      nombre: this.nombre,
      username: this.username, 
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        this.success = 'Usuario creado y logueado con éxito';
        
        const returnUrl = localStorage.getItem('returnUrl');

        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          if (returnUrl) {
            localStorage.removeItem('returnUrl');
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate(['/']);
          }
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.msg || 'Error al registrar el usuario';
        this.loading = false;
        console.error(err);
      }
    });
  }
}