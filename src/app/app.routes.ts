import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailProductsComponent } from './pages/detail-products/detail-products.component';
import { AuthComponent } from './pages/auth/auth.component';
import { RegisterComponent } from './pages/register/register.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { DetalleOrdenesComponent } from './pages/detalle-ordenes/detalle-ordenes.component';
import { authGuard } from './guards/auth.guard';
import { checkoutGuard } from './guards/checkout.guard';
import { AdminHomeComponent } from './admin/pages/home/admin-home/admin-home.component';
import { AdminListOrdenesComponent } from './admin/pages/ordenes/admin-list-ordenes/admin-list-ordenes.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ProductsComponent } from './admin/pages/CRUD/products/products.component';
import { adminGuard } from './admin/guards/admin.guard';
import { AdminOrdenDetalleComponent } from './admin/pages/ordenes/admin-orden-detalle/admin-orden-detalle.component';
import { CrearProductoComponent } from './admin/pages/CRUD/crear-producto/crear-producto.component';
import { EditarProductoComponent } from './admin/pages/CRUD/editar-producto/editar-producto.component';
import { AdminUsuarioOrdenesComponent } from './admin/pages/usuarios-clientes/admin-usuario-ordenes/admin-usuario-ordenes.component';
import { AdminListUsuariosComponent } from './admin/pages/usuarios-clientes/admin-list-usuarios/admin-list-usuarios.component';


export const routes: Routes = [
{ path: '', redirectTo: 'home', pathMatch: 'full' },

{ path: 'home', component: HomeComponent },
{ path: 'tienda', component: TiendaComponent },

{ path: 'products/:id', component: DetailProductsComponent },
{ path: 'ordenes/:id', component: DetalleOrdenesComponent },

{ path: 'login', component: AuthComponent },
{ path: 'register', component: RegisterComponent },

{ path: 'checkout', component: CheckoutComponent, 
canActivate:[authGuard], 
canDeactivate:[checkoutGuard]
 },


{ path: 'ordenes', component: OrdenesComponent,canActivate:[authGuard] },
{ path: 'orden/:id', component: DetalleOrdenesComponent, canActivate: [authGuard] },
// admin
{ path: 'admin', component: AdminHomeComponent, 
canActivate:[adminGuard],
children:[
    { path: 'ordenes', component: AdminListOrdenesComponent },
    { path: 'ordenes/:id', component: AdminOrdenDetalleComponent },
    { path: 'productos', component: ProductsComponent },
    { path: 'crear', component: CrearProductoComponent },
    { path: 'editar/:id', component: EditarProductoComponent },
    { path: 'usuarios', component: AdminListUsuariosComponent },
    { path: 'usuarios/:id/ordenes', component: AdminUsuarioOrdenesComponent }

]
},

{ path: '**', redirectTo: 'home' }]