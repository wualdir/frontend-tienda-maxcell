import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest} from '../../models/auth.model'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;
   
  constructor(private authService: AuthService,private router:Router) {}

onSubmit() {
  this.loading = true;
  this.error = null;

  const data: LoginRequest = {
    username: this.username,
    password: this.password
  };

  this.authService.login(data).subscribe({
    next: (res) => {

     const returnUrl = localStorage.getItem('returnUrl');

console.log('RETURN URL:', returnUrl);

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

    error: () => {
      this.error = 'Credenciales incorrectas';
      this.loading = false;
    }
  });
}}