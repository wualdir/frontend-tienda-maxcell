import { CanDeactivateFn } from '@angular/router';
import { CheckoutComponent } from '../pages/checkout/checkout.component';

export const checkoutGuard: CanDeactivateFn<CheckoutComponent> = (component) => {
 
  // si ya confirmo  -> salir sin preguntar
 if(component.confirmado)
 {
   return true
 }
  // 🔥 si el carrito está vacío → puede salir
  if (component.cart.length === 0) {
    return true;
  }

  // ⚠️ si tiene productos → confirmar
  return confirm('¿Seguro que quieres salir del checkout?');
};
