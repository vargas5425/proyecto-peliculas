// src/peliculas/dtos/index.ts
import { IsString, IsNumber, Min, Max, IsOptional } from "class-validator";

export class CreatePeliculaDto {
    @IsString()
    titulo: string;

    @IsNumber()
    @Min(1888)
    @Max(2030)
    anio: number;

    @IsString()
    imagen: string; // Ahora será el nombre del archivo
}

export class UpdatePeliculaDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsOptional()
    @IsNumber()
    @Min(1888)
    @Max(2030)
    anio?: number;

    @IsOptional()
    @IsString()
    imagen?: string;
}

export class PeliculaResponseDto {
    id: number;
    titulo: string;
    anio: number;
    imagen: string;
    calificacionPromedio: number;
    reviews?: any[];
}
