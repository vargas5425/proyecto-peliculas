// reviews/dtos/review-response.dto.ts
export class UsuarioResponseDto {
    id: number;
    nombre: string;
    correo: string;
}

export class PeliculaResponseDto {
    id: number;
    titulo: string;
    anio: number;
    imagen: string;
    calificacionPromedio: number;
}

export class ReviewResponseDto {
    id: number;
    texto: string;
    puntuacion: number;
    pelicula: PeliculaResponseDto;
    usuario: UsuarioResponseDto;
}
