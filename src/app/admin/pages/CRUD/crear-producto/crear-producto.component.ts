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

  // Modelo de datos sincronizado con el Backend
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

  // Gestión de archivos
  imagenes: File[] = [];
  imagePreviews: string[] = [];
  loading = false;


  // Maneja la selección de múltiples imágenes
  onFilesSelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files) as File[];
    
    // Acumulamos archivos para el envío
    this.imagenes = [...this.imagenes, ...newFiles];

    // Generamos las previsualizaciones
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    // Limpiamos el input para permitir re-selección
    event.target.value = '';
  }

  // Quitar imagen de la lista antes de subir
  removeImage(index: number) {
    this.imagenes.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  guardar() {
    if (this.imagenes.length === 0) return alert('Debes subir al menos una imagen');
    
    this.loading = true;
    const formData = new FormData();

    // Campos base
    Object.entries(this.producto).forEach(([key, value]) => {
      if (key !== 'specs') formData.append(key, value.toString());
    });

    // Especificaciones técnicas
    Object.entries(this.producto.specs).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Adjuntar array de imágenes
    this.imagenes.forEach(file => {
      formData.append('imagenes', file);
    });

    this.service.createProduct(formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Error al guardar el producto');
      }
    });
  }
}