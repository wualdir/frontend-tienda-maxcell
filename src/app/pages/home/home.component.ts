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

  constructor(private state: ProductService) {
    this.productos$ = this.state.productos$;
    this.loading$ = this.state.loading$;
  }
}