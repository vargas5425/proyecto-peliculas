export interface Usuario {
  id: number;
  nombre: string;
  email?: string;
  token?: string;
}

export interface Review {
  id: number;
  texto: string;
  puntuacion: number;
  usuario: Usuario;
}

export interface Pelicula {
  id: number;
  titulo: string;
  anio: number;
  imagen: string;
  calificacionPromedio: number;
  reviews: Review[];
}