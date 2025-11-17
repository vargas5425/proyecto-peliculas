import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from "class-validator";

export class CreatePeliculaDto {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1888)
    @Max(new Date().getFullYear() + 5)
    anio: number;

    @IsNotEmpty()
    @IsString()
    imagen: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    calificacionPromedio?: number;
}
