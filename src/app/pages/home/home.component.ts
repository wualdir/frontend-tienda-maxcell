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
    this.productos$ = this.state.productos$.pipe(
      map(prods => {
        return [...prods].sort((a, b) => {
          // Extraemos los valores de forma segura. Si no existen, usamos 0.
          const precioOrigA = a.precioOriginal || 0;
          const precioOrigB = b.precioOriginal || 0;

          // 1. Calculamos el beneficio en dinero real (Soles)
          const ahorroA = precioOrigA > a.precio ? (precioOrigA - a.precio) : 0;
          const ahorroB = precioOrigB > b.precio ? (precioOrigB - b.precio) : 0;
          
          // 2. Calculamos el beneficio en porcentaje
          const porcA = precioOrigA > 0 ? (ahorroA / precioOrigA) * 100 : 0;
          const porcB = precioOrigB > 0 ? (ahorroB / precioOrigB) * 100 : 0;

          // 3. Regla de impacto emocional de la oferta
          const scoreA = ahorroA > 100 ? ahorroA : ahorroA + (porcA * 1.5);
          const scoreB = ahorroB > 100 ? ahorroB : ahorroB + (porcB * 1.5);
          
          // Ordenamos de mayor a menor score de impacto
          return scoreB - scoreA;
        }).slice(0, 3); // Tomamos los 3 mejores para la sección de destacados
      })
    );
    this.loading$ = this.state.loading$;
  }
  slides = [
    { 
      image: 'Logo_Main.jpeg',
      title: '',
      subtitle: 'ubicanos en pedro ruiz jr. soriano morgan Nª624',
      link: '', 
      badge: 'Nuevo'
    },
    { 
      image: 'https://res.cloudinary.com/ditrjgxya/image/upload/v1778188988/Banner-carrusel_qf1dxl.jpg',
      title: '',
      subtitle: 'Lo mejor en lo ultimo en tecnología',
      link: '', 
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
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}