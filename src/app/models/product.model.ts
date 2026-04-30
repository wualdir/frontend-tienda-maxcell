export interface Producto {
    id: string;
    marca: string;
    modelo: string;
    precio: number;
    precioOriginal?: number;
    stock: number;
    
    // 🔥 Coincide con el Backend
    imagenes: string[]; 
    videoUrl?: string; 
    
    descripcion: string;
    especificaciones: {
        camaraPrincipal: string;
        pantalla: string;
        bateria: string;
        ram: number;           // Para mostrarlo usas: {{ producto.especificaciones.ram }}GB
        almacenamiento: number; // Para mostrarlo usas: {{ producto.especificaciones.almacenamiento }}GB
    };
    disponible: boolean;
    
    // Virtuals que vienen del Backend
    enOferta?: boolean;
    hayStock?: boolean;
}