import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {

   const router = inject(Router); // 👈 ESTO FALTABA
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }
    console.log('GUARD URL:', state.url); // 👈 DEBUG IMPORTANTE

  // 👇 guardamos la ruta a la que quería entrar
  localStorage.setItem('returnUrl', state.url);

  router.navigate(['/login']);
  return false;
};