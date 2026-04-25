import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { OrdenesService } from '../../services/ordenes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  cart:CartItem[] = []
  confirmado = false
  constructor(
    private carritoService:CarritoService,
    private router:Router,
    private ordenesService:OrdenesService,private authService:AuthService){}

  ngOnInit() {
  this.loadCart();
   this.carritoService.getCart().subscribe(items => {
  this.carritoService.syncCart(items).subscribe();
});
}
loadCart(){
  this.carritoService.getCart().subscribe(data => {
    this.cart = data;
  });
}
get total() {
  return this.cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  
}
//confirmar compra ==> pagina de confirmacion
confirmarCompra() {

  const token = this.authService.getToken();

  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  this.carritoService.getCart().subscribe(items => {

    if (!items || items.length === 0) {
      alert('Carrito vacío');
      return;
    }

    this.carritoService.syncCart(items).subscribe({

      next: () => {

        this.ordenesService.createOrder().subscribe({

          next: (orden) => {

            this.confirmado = true;

            localStorage.setItem('lastOrder', JSON.stringify(orden));

            this.carritoService.clearCart().subscribe(() => {
              this.router.navigate(['/orden', orden.id]);
            });

          },

          error: (err) => {

            console.log('ERROR ORDER:', err);

            if (err.status === 400) {
              alert(err.error.msg || 'Stock insuficiente');
              this.loadCart();

            } else if (err.status === 401) {
              alert('Sesión expirada');
              this.router.navigate(['/login']);

            } else {
              alert(err.error?.msg || 'Error interno del servidor');
            }

          }

        });

      },

      error: (err) => {
        console.log('ERROR SYNC:', err);
        alert('Error sincronizando carrito');
      }

    });

  });

}}