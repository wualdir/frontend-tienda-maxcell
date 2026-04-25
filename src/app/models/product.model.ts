export interface Producto {
    id: string;
    marca: string;
    modelo: string;
    precio: number;
    precioOriginal?: number; // Para mostrar el precio tachado y descuentos
    stock: number;
    imagen: string;
    descripcion: string;
    // Atributos técnicos para renderizar los iconos de specs
    especificaciones: {
        camaraPrincipal: string; // ej: "108MP"
        pantalla: string;        // ej: "AMOLED 120Hz"
        bateria: string;         // ej: "5000mAh"
        ram: number;             // ej: "8GB"
        almacenamiento: number;  // ej: "256GB"
    };
    disponible: boolean;
}


