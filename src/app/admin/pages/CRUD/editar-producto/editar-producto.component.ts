import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductoService } from '../../../services/admin-producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../../models/product.model';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  id!: string;
  loading = false;

  // Propiedades vinculadas al formulario (NgModel)
  modelo = '';
  marca = '';
  precio = 0;
  precioOriginal = 0;
  stock = 0;
  descripcion = '';

  // Objeto local para manejar los inputs del formulario
  specs = {
    espeCamPrincipal: '',
    espePantalla: '',
    espeBateria: '',
    espeRam: '',
    espeAlmacenamiento: ''
  };

  // Gestión de archivos e imágenes
  imagen: File | null = null;
  imagePreview: string | null = null;
  imagenUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: AdminProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.service.getById(this.id).subscribe((data: Producto) => {
      this.modelo = data.modelo;
      this.marca = data.marca;
      this.precio = data.precio;
      this.precioOriginal = data.precioOriginal || 0;
      this.stock = data.stock;
      this.descripcion = data.descripcion;
      this.imagenUrl = data.imagen;

      // Mapeo desde el objeto anidado 'especificaciones' de tu interfaz
      if (data.especificaciones) {
        this.specs = {
          espeCamPrincipal: data.especificaciones.camaraPrincipal,
          espePantalla: data.especificaciones.pantalla,
          espeBateria: data.especificaciones.bateria,
          // Convertimos a string para que el input de texto no dé problemas
          espeRam: data.especificaciones.ram.toString(),
          espeAlmacenamiento: data.especificaciones.almacenamiento.toString()
        };
      }
    });
  }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      // Generar previsualización local
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  actualizar() {
    this.loading = true;
    const formData = new FormData();

    // 1. Datos básicos
    formData.append('modelo', this.modelo);
    formData.append('marca', this.marca);
    formData.append('precio', this.precio.toString());
    formData.append('precioOriginal', this.precioOriginal.toString());
    formData.append('stock', this.stock.toString());
    formData.append('descripcion', this.descripcion);

    // 2. Imagen (solo si se cambió)
    if (this.imagen) {
      formData.append('imagen', this.imagen);
    }

    // 3. Especificaciones (Enviamos los campos planos como los suele esperar el Backend)
    formData.append('camaraPrincipal', this.specs.espeCamPrincipal);
    formData.append('pantalla', this.specs.espePantalla);
    formData.append('bateria', this.specs.espeBateria);
    formData.append('ram', this.specs.espeRam);
    formData.append('almacenamiento', this.specs.espeAlmacenamiento);

    this.service.updateProduct(this.id, formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.loading = false;
      }
    });
  }
}