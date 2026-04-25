import { HttpInterceptorFn } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from "../../environments/environment"; // 👈 Importante importar esto

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  let reqClonada = req;

  // 1. Verificamos si hay token y si la petición va dirigida a nuestra API (dinámica)
  if (token && req.url.includes(environment.apiUrl)) {
    reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(reqClonada).pipe(
    catchError((error) => {
      // 2. Si el servidor responde 401, el token ya no sirve
      if (error.status === 401) {
        console.warn('Sesión expirada o token inválido');

        // Limpiamos los datos para obligar a un nuevo login
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        
        // Opcional: Redirigir automáticamente
        // window.location.href = '/login';
      }

      return throwError(() => error);
    })
  );
};