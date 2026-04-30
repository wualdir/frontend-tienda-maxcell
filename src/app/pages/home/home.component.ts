import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProductsComponent } from "../list-products/list-products.component";
import { ProductService } from '../../services/product.service';


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
    this.productos$ = this.state.productos$;
    this.loading$ = this.state.loading$;
  }

  slides = [
    { image: 'assets/promo1.jpg', title: 'Nuevos iPhone 15', subtitle: 'Potencia y elegancia en tus manos.' },
    { image: 'assets/promo2.jpg', title: 'Gaming Series', subtitle: 'Los mejores equipos para jugadores exigentes.' },
    { image: 'assets/promo3.jpg', title: 'Accesorios Max', subtitle: 'Todo lo que necesitas para tu setup.' }
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