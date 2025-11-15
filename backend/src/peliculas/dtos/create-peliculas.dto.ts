import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreatePeliculaDto {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1888) // Primer año del cine
    @Max(new Date().getFullYear() + 5) // Hasta 5 años en el futuro
    anio: number; // ← Cambiado de "año" a "anio"

    @IsNotEmpty()
    @IsString()
    imagen: string; // ← Cambiado de "poster" a "imagen"

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    calificacionPromedio?: number;

    // Campos que NO están en tu entidad - ELIMINAR:
    // director: string; ← No existe en tu entidad
    // genero: string; ← No existe en tu entidad
    // sinopsis?: string; ← No existe en tu entidad
    // duracion?: number; ← No existe en tu entidad
}
