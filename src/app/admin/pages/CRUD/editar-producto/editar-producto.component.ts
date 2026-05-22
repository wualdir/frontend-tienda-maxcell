import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductoService } from '../../../services/admin-producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CloudinaryUrlPipe } from '../../../../pages/pipes/cloudinary.pipe';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CloudinaryUrlPipe],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AdminProductoService);
  private router = inject(Router);

  id!: string;
  loading = false;
  // Estructura inicializada para evitar undefined
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
      espeRam: 0,
      espeAlmacenamiento: 0
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
        ...data,
        specs: {
          espeCamPrincipal: data.especificaciones?.camaraPrincipal || '',
          espePantalla: data.especificaciones?.pantalla || '',
          espeBateria: data.especificaciones?.bateria || '',
          espeRam: data.especificaciones?.ram || 0,
          espeAlmacenamiento: data.especificaciones?.almacenamiento || 0
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

  removeExistingImage(index: number) { this.imagenesActuales.splice(index, 1); }
  removeNewImage(index: number) { 
    this.imagenesNuevas.splice(index, 1); 
    this.imagePreviews.splice(index, 1); 
  }

  private extraerId(value: string): string {
    if (!value) return '';
    if (!value.toString().startsWith('http')) return value;
    const parts = value.split('/upload/');
    if (parts.length > 1) {
      return parts[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, "");
    }
    return value;
  }

  actualizar() {
    this.loading = true;
    const formData = new FormData();

    // 1. Campos de texto básicos
    formData.append('modelo', this.producto.modelo);
    formData.append('marca', this.producto.marca);
    formData.append('precio', (this.producto.precio || 0).toString());
    formData.append('precioOriginal', (this.producto.precioOriginal || 0).toString());
    formData.append('stock', (this.producto.stock || 0).toString());
    formData.append('descripcion', this.producto.descripcion);
   formData.append('disponible', this.producto.disponible ? 'true' : 'false');
    
    // 2. Especificaciones (Asegurando que sean strings numéricos válidos)
    formData.append('espeCamPrincipal', this.producto.specs.espeCamPrincipal);
    formData.append('espePantalla', this.producto.specs.espePantalla);
    formData.append('espeBateria', this.producto.specs.espeBateria);
    formData.append('espeRam', (this.producto.specs.espeRam || 0).toString());
    formData.append('espeAlmacenamiento', (this.producto.specs.espeAlmacenamiento || 0).toString());

    // 3. Imágenes conservadas (IDs limpios)
    const idsParaConservar = this.imagenesActuales.map(img => this.extraerId(img));
    formData.append('imagenesRestantes', JSON.stringify(idsParaConservar));

    // 4. Archivos nuevos
    this.imagenesNuevas.forEach(file => formData.append('imagenes', file));

    this.service.updateProduct(this.id, formData).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: (err) => {
        console.error("Error al actualizar:", err);
        this.loading = false;
      }
    });
  }
}