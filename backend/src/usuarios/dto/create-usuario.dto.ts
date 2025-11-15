import { IsNotEmpty, IsString, MinLength } from "class-validator";
export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    correo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(64)
    password: string;
}
