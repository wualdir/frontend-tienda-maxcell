import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  error: string | null = null;
  success: string | null = null;
  loading = false;

  constructor(private authService: AuthService,private router:Router) {}

 onSubmit() {
  this.loading = true;
  this.error = null;
  this.success = null;

  const data: RegisterRequest = { username: this.username, password: this.password };

  this.authService.register(data).subscribe({
    next: (res) => {
      // 🚀 ¡MAGIA! El servicio ya guardó el token y sincronizó el carrito en el tap.
      this.success = 'Usuario creado y logueado con éxito';
      
      const returnUrl = localStorage.getItem('returnUrl');

      // Usamos el método isAdmin del servicio para mayor limpieza
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
      this.error = 'Error al registrar el usuario';
      this.loading = false;
      console.error(err);
    }
  });
}
}
