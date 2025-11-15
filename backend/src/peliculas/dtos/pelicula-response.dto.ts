export class PeliculaResponseDto {
    id: number;
    titulo: string;
    anio: number;
    imagen: string;
    calificacionPromedio: number;
    reviews?: any[];
}
