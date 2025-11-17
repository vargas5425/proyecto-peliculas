// reviews/dtos/create-review.dto.ts
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PeliculaIdDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

class UsuarioIdDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    texto: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 1 })
    @Min(1)
    @Max(10)
    puntuacion: number;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => PeliculaIdDto)
    pelicula: PeliculaIdDto;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UsuarioIdDto)
    usuario: UsuarioIdDto;
}
