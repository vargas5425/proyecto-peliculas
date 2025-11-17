export interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

export interface Review {
  id: number;
  texto: string;
  puntuacion: number;
  usuario: { id: number;
    nombre: string;
    correo?: string;};
}

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  imagen: string;
  calificacionPromedio: number;
  reviews: Review[];
}