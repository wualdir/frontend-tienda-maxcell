import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from "../list-products/list-products.component";
import { ProductService } from '../../services/product.service';
import { map } from 'rxjs';


@Component({
  selector: 'app-home',
  imports: [CommonModule, ListProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  productos$;
  loading$;
  currentSlide = 0;
  private intervalId: any;

  constructor(private state: ProductService) {
   // Usamos pipe y map para transformar la lista antes de que llegue al HTML
    this.productos$ = this.state.productos$.pipe(
      map(prods => {
        return [...prods].sort((a, b) => {
          // Calculamos el porcentaje de descuento de cada uno
          const descA = a.precioOriginal ? (a.precioOriginal - a.precio) / a.precioOriginal : 0;
          const descB = b.precioOriginal ? (b.precioOriginal - b.precio) / b.precioOriginal : 0;
          
          // Ordenar de mayor a menor descuento
          return descB - descA;
        }).slice(0, 3); // Tomamos solo los 3 mejores DESPUÉS de ordenar
      })
    );
    this.loading$ = this.state.loading$;
  }


slides = [
  { 
    image: 'Logo_Main.jpeg',
  title: '',
    subtitle: 'ubicanos en pedro ruiz jr. soriano morgan Nª624',
    link: '', // Link específico
    badge: 'Nuevo'
  },
  { 
    image: 'https://res.cloudinary.com/ditrjgxya/image/upload/v1778188988/Banner-carrusel_qf1dxl.jpg',
  title: '',
    subtitle: 'Lo mejor en lo ultimo en tecnología',
    link: '', // Link específico
    badge: 'Nuevo'
  },
  { 
    image: 'https://res.cloudinary.com/ditrjgxya/image/upload/w_1200,h_500,c_fill,g_auto,q_auto,f_auto/carrusel-3_qc2rnw.webp', 
    title: 'Explora tus mejores emociones', 
    subtitle: 'adquiere tus nuevos modelos de celulares',
    link: '/products/categoria/gaming',
    badge: 'Popular'
  }
  
];


  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => this.nextSlide(), 5000); // Cambia cada 5 segundos
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}