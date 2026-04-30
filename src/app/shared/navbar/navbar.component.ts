import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 //carrito global
  cartCount = 0;
  //para el menu hamburgesa
  isOpen= false
  //para busqueda navbar
searchTerm: string = '';
resultados: any[] = [];

// 1. Inyectamos el servicio fuera del constructor
private authService = inject(AuthService);
private carritoService = inject(CarritoService);
// 2. Ahora sí podemos usarlo aquí mismo
  isAdmin$ = this.authService.isAdmin$;
  isLoggedIn$ = this.authService. isLoggedIn$;
  user$ = this.authService.user$;
  cartCount$ = this.carritoService.cartCount$;
  isMenuOpen = false;
 

constructor(
  private router:Router,
  private productService:ProductService
) {}

ngOnInit() {
  // 🚀 Le pedimos al servicio que inicialice el carrito.
  // Como el servicio tiene un 'tap', al ejecutarse esto, 
  // el cartCount$ del Navbar se actualizará solo.
  this.carritoService.getCart().subscribe();
}

buscar() {
  const texto = this.searchTerm?.trim() || '';

  // 1. Si está vacío, limpiamos y mandamos a la tienda
  if (texto === '') {
    this.productService.getProductosFiltrados({}); // Mandamos filtros vacíos para resetear
    this.router.navigate(['/tienda']);
    return;
  }

  if (texto.length < 2) return;

  // 2. 🚀 LA CORRECCIÓN: Solo llamamos al método. 
  // No hay .subscribe() porque el resultado caerá solo en el flujo 'productos$'
  this.productService.getProductosFiltrados({ q: texto });
  
  // Opcional: Si quieres que al buscar siempre te lleve a la página de tienda para ver resultados
  if (this.router.url !== '/tienda') {
    this.router.navigate(['/tienda']);
  }
}
// ================para el boton de busqueda===========
buscarConBoton() {
  const texto = this.searchTerm?.trim() || '';
  // 🔥 vacío → lista completa
  if (texto === '') {
    this.router.navigate(['/home']);
    return;
  }
  // 🔥 ir a lista con filtro
  this.router.navigate(['/home'], {
    queryParams: { q: texto }
  });

  // opcional: limpiar dropdown
  this.resultados = [];
}

irProducto(id: string) {
  this.router.navigate(['/products', id]);
  this.resultados = []; // cerrar dropdown
}
cerrarResultados() {
  setTimeout(() => {
    this.resultados = [];
  }, 200); // 👈 evita que se cierre antes del click
}

toggleMenu() {
  this.isOpen = !this.isOpen;
  // Opcional: Bloquear el scroll del cuerpo cuando el menú está abierto
  if (this.isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
}
closeMenu() {
  this.isOpen = false;
  document.body.style.overflow = 'auto';
}

//para el carrito 
 verCarrito() {
  this.carritoService.openCart();
}

cerraSesion(){
  this.authService.logout()
  this.carritoService.getCart().subscribe(items => {
      this.carritoService.setCart(items);
    });
  this.router.navigate(['']);
  
}

onLogout() {
    this.authService.logout();
    // Opcional: limpiar carrito al salir
    this.carritoService.clearCart().subscribe();
  }

}
