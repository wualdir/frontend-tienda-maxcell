import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { CheckoutComponent } from '../pages/checkout/checkout.component';
import { CarritoService } from '../services/carrito.service';

export const checkoutGuard: CanDeactivateFn<CheckoutComponent> = (component) => {
  const carritoService = inject(CarritoService);

  // 1. Si ya confirmó la compra, puede salir libremente
  if (component.confirmado) {
    return true;
  }

  // 2. 🚀 LA CORRECCIÓN: 
  // Usamos el método público 'getLocalCart()' que creamos en el servicio
  // para saber qué hay en el carrito de forma síncrona.
  const itemsEnCarrito = carritoService.getLocalCart();

  if (itemsEnCarrito.length === 0) {
    return true;
  }

  // 3. Si hay productos y no ha confirmado, preguntamos
  return confirm('¿Seguro que quieres salir? Los productos en tu carrito se mantendrán, pero saldrás del proceso de pago.');
};