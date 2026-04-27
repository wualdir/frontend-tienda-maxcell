import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductoService } from '../../../services/admin-producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AdminProductoService);
  private router = inject(Router);

  id!: string;
  loading = false;

  // Objeto reactivo para el formulario
  producto: any = {
    modelo: '',
    marca: '',
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
  imagenUrlActual: string | null = null;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.cargarDatos();
  }

  cargarDatos() {
    this.service.getById(this.id).subscribe((data) => {
      // Mapeamos los datos recibidos al objeto local
      this.producto = {
        modelo: data.modelo,
        marca: data.marca,
        precio: data.precio,
        precioOriginal: data.precioOriginal || 0,
        stock: data.stock,
        descripcion: data.descripcion,
        specs: {
          espeCamPrincipal: data.especificaciones?.camaraPrincipal || '',
          espePantalla: data.especificaciones?.pantalla || '',
          espeBateria: data.especificaciones?.bateria || '',
          espeRam: data.especificaciones?.ram?.toString() || '',
          espeAlmacenamiento: data.especificaciones?.almacenamiento?.toString() || ''
        }
      };
      this.imagenUrlActual = data.imagen || null;
    });
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  actualizar() {
    this.loading = true;
    const formData = new FormData();

   // 1. Añadimos datos básicos tipando 'value' como 'any' o 'string | number'
Object.entries(this.producto).forEach(([key, value]) => {
  // Verificamos que no sea el objeto de specs y que el valor no sea nulo
  if (key !== 'specs' && value !== null && value !== undefined) {
    formData.append(key, String(value)); // String() es más seguro que .toString()
  }
});

    // 2. Añadimos specs (con los nombres que espera el backend)
    formData.append('camaraPrincipal', this.producto.specs.espeCamPrincipal);
    formData.append('pantalla', this.producto.specs.espePantalla);
    formData.append('bateria', this.producto.specs.espeBateria);
    formData.append('ram', this.producto.specs.espeRam);
    formData.append('almacenamiento', this.producto.specs.espeAlmacenamiento);

    // 3. Imagen solo si se cambió
    if (this.imagen) formData.append('imagen', this.imagen);

    this.service.updateProduct(this.id, formData).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: () => this.loading = false
    });
  }
}