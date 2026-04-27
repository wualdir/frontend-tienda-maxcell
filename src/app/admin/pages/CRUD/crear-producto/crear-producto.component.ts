import { Component, inject } from '@angular/core';
import { AdminProductoService } from '../../../services/admin-producto.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent {
  private service = inject(AdminProductoService);
  private router = inject(Router);

  // Modelo de datos limpio
  producto = {
    marca: '',
    modelo: '',
    precio: 0,
    precioOriginal: 0,
    stock: 0,
    descripcion: '',
    specs: {
      espeCamPrincipal: '',
      espePantalla: '',
      espeBateria: '',
      espeRam: '',
      espeAlmacenamiento: ''
    }
  };

  imagen: File | null = null;
  imagePreview: string | null = null;
  loading = false;

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (!this.imagen) return alert('La imagen del dispositivo es obligatoria');
    
    this.loading = true;
    const formData = new FormData();

    // Llenado dinámico para no repetir .append 20 veces
    Object.entries(this.producto).forEach(([key, value]) => {
      if (key !== 'specs') {
        formData.append(key, value.toString());
      }
    });

    // Añadir specs
    Object.entries(this.producto.specs).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('imagen', this.imagen);

    this.service.createProduct(formData).subscribe({
      next: () => {
        // No necesitamos refrescar nada aquí, el SERVICE ya lo hizo por nosotros
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error al crear:', err);
        this.loading = false;
        alert('Error al guardar el producto. Revisa la consola.');
      }
    });
  }
}