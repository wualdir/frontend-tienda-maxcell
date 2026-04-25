import { Component } from '@angular/core';
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
  // Campos del formulario
  marca = '';
  modelo = '';
  precio = 0;
  precioOriginal = 0;
  stock = 0;
  descripcion = '';
  
  // Especificaciones agrupadas
  specs = {
    espeCamPrincipal: '',
    espePantalla: '',
    espeBateria: '',
    espeRam: '',
    espeAlmacenamiento: ''
  };

  // Estado y Archivos
  imagen: File | null = null;
  imagePreview: string | null = null;
  loading = false;

  constructor(
    private service: AdminProductoService,
    private router: Router
  ) {}

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      // Previsualización de la imagen
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (!this.imagen) return alert('Debes subir una imagen');
    
    this.loading = true;
    const formData = new FormData();

    // Campos principales
    formData.append('marca', this.marca);
    formData.append('modelo', this.modelo);
    formData.append('precio', this.precio.toString());
    formData.append('precioOriginal', this.precioOriginal.toString());
    formData.append('stock', this.stock.toString());
    formData.append('descripcion', this.descripcion);
    formData.append('imagen', this.imagen);

    // Especificaciones
    formData.append('espeCamPrincipal', this.specs.espeCamPrincipal);
    formData.append('espePantalla', this.specs.espePantalla);
    formData.append('espeBateria', this.specs.espeBateria);
    formData.append('espeRam', this.specs.espeRam);
    formData.append('espeAlmacenamiento', this.specs.espeAlmacenamiento);

    this.service.createProduct(formData).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}