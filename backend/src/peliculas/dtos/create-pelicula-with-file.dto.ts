import { IsString, IsNumber, Min, Max, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class CreatePeliculaWithFileDto {
    @IsNotEmpty()
    @IsString()
    titulo: string;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1888)
    @Max(2030)
    anio: number;
}
