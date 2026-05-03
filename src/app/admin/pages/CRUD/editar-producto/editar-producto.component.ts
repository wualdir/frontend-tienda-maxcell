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

  imagenesNuevas: File[] = [];
  imagePreviews: string[] = [];
  imagenesActuales: string[] = [];

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.cargarDatos();
  }

  cargarDatos() {
    this.service.getById(this.id).subscribe((data) => {
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
      this.imagenesActuales = [...(data.imagenes || [])];
    });
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files) as File[];
      this.imagenesNuevas = [...this.imagenesNuevas, ...newFiles];

      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => this.imagePreviews.push(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  // Quitar de la lista de nuevas (antes de subir)
  removeNewImage(index: number) {
    this.imagenesNuevas.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  // Quitar de las que ya existen en la BD
  removeExistingImage(index: number) {
    this.imagenesActuales.splice(index, 1);
  }

  actualizar() {
    this.loading = true;
    const formData = new FormData();

    // 1. Datos básicos
    formData.append('modelo', this.producto.modelo);
    formData.append('marca', this.producto.marca);
    formData.append('precio', this.producto.precio.toString());
    formData.append('precioOriginal', this.producto.precioOriginal.toString());
    formData.append('stock', this.producto.stock.toString());
    formData.append('descripcion', this.producto.descripcion);

    // 2. Specs para el Backend
    formData.append('espeCamPrincipal', this.producto.specs.espeCamPrincipal);
    formData.append('espePantalla', this.producto.specs.espePantalla);
    formData.append('espeBateria', this.producto.specs.espeBateria);
    formData.append('espeRam', this.producto.specs.espeRam);
    formData.append('espeAlmacenamiento', this.producto.specs.espeAlmacenamiento);

    // 3. Imágenes nuevas
    this.imagenesNuevas.forEach(file => {
      formData.append('imagenes', file);
    });

    // 4. 🔥 Enviamos el array de imágenes que decidimos conservar
    // Nota: El backend debe estar preparado para recibir este campo
    formData.append('imagenesRestantes', JSON.stringify(this.imagenesActuales));

    this.service.updateProduct(this.id, formData).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: (err) => {
        console.error("Error al actualizar:", err);
        this.loading = false;
      }
    });
  }
}