import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryUrl',
  standalone: true
})
export class CloudinaryUrlPipe implements PipeTransform {
  transform(value: string, width: number = 400, height: number = 500): string {
    if (!value) return 'https://via.placeholder.com/400x500';

    const cloudName = 'ditrjgxya';
    const timestamp = new Date().getTime();
    
    // 1. Obtenemos el ID limpio
    let publicId = value;
    if (value.startsWith('http')) {
      // Si es URL completa, extraemos el ID (asumiendo que viene después de /upload/)
      const parts = value.split('/upload/');
      if (parts.length > 1) {
        // Quitamos la versión si existe (v12345/) y nos quedamos con el resto
        publicId = parts[1].replace(/^v\d+\//, '');
      }
    }

    // 2. Aplicamos las transformaciones de tamaño y recorte
    // w_ = width, h_ = height, c_fill = recorta sin deformar, g_auto = centra el producto
    const transformations = `w_${width},h_${height},c_fill,g_auto,f_auto,q_auto`;

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}?t=${timestamp}`;
  }
}