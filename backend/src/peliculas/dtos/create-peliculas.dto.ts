import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

export class CreatePeliculaDto {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1888)
    @Max(new Date().getFullYear() + 5)
    anio: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    calificacionPromedio?: number;
}
