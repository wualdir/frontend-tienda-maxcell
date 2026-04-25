import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {authInterceptor } from './interceptores/auth';
import { ProductService } from './services/product.service';

export const appConfig: ApplicationConfig = {
  providers: [

    // 🔥 ESTO ES LO QUE TE FALTABA
    provideRouter(routes),
    
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideHttpClient(withInterceptors([authInterceptor])),

    // 🔥 PRELOAD GLOBAL
    provideAppInitializer(() => {
      const productService = inject(ProductService);
      productService.cargarProductos();
    })
    
    
    ]
    

};
