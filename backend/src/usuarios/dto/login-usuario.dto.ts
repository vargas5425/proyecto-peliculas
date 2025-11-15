import { IsNotEmpty, IsString, MinLength } from "class-validator";
export class LoginUsuarioDto {
    @IsNotEmpty()
    @IsString()
    correo: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(64)
    contrasena: string;
}
