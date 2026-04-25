import { Component } from '@angular/core';
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
 //para el nombre del usuario
 nombreAct : string = ''
 //para el rol 
 isAdmin = false
 // Variable que usaremos en el HTML
  estaLogueado: boolean = false;
  //para el menu hamburgesa
  isOpen= false
  //para busqueda navbar
searchTerm: string = '';
resultados: any[] = [];
constructor(
  private carritoService: CarritoService,
  private authService:AuthService,
  private router:Router,
  private productService:ProductService
) {}


ngOnInit() {

  this.carritoService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });

  this.authService.isLoggedIn$.subscribe(estado => {
    this.estaLogueado = estado;
  });

  this.authService.role$.subscribe(role => {
    this.isAdmin = role === 'CodVic';
  });

  this.authService.user$.subscribe(user => {
    this.nombreAct = user || '';
  });
}

buscar() {
  const texto = this.searchTerm?.trim() || '';
  // 🔥 SI ESTÁ VACÍO → IR A LISTA
  if (texto === '') {
    this.resultados = [];
    this.router.navigate(['/tienda']); // 👈 CLAVE
    return;
  }

  if (texto.length < 2) {
    return;
  }

  this.productService.searchProducts(texto)
    .subscribe(data => {
      this.resultados = data;
    });
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
}
closeMenu() {
  this.isOpen = false;
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
  }

}
