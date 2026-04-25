import { HttpInterceptorFn } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  let reqClonada = req;

  if (token && req.url.includes('http://localhost:3000/api')) {
    reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(reqClonada).pipe(
    catchError((error) => {

      if (error.status === 401) {
        console.log('Token expirado o inválido');

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // opcional: redirigir a login
        // window.location.href = '/login';
      }

      return throwError(() => error);
    })
  );
};