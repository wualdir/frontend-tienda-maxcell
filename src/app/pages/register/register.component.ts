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

    const data: RegisterRequest = {username: this.username,password: this.password};
    this.authService.register(data).subscribe({next: () => {

    // 🔥 hacer login automático
    this.authService.login({username: data.username,password: data.password}).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token,res.user.role,res.user.username);
        this.authService.handlePostAuth();
          const returnUrl = localStorage.getItem('returnUrl');

console.log('RETURN URL:', returnUrl);

if (res.user.role === 'admin') {
  this.router.navigate(['/admin']);
} else {
  if (returnUrl) {
    localStorage.removeItem('returnUrl');
    this.router.navigateByUrl(returnUrl);
  } else {
    this.router.navigate(['/']);
  }
}

         
      }
    });
  

  },
  error: (err) => console.error(err)
});

  }
}
