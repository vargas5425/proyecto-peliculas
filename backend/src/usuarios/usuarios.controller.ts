import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { CreateUsuarioDto, LoginUsuarioDto, UsuarioResponseDto } from "./dto";

@Controller("usuarios")
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Post("registro")
    async registrar(@Body() createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
        return this.usuariosService.registrar(createUsuarioDto);
    }

    @Post("login")
    async login(@Body() loginUsuarioDto: LoginUsuarioDto): Promise<UsuarioResponseDto> {
        return this.usuariosService.login(loginUsuarioDto);
    }

    @Get()
    async obtenerTodos(): Promise<UsuarioResponseDto[]> {
        return this.usuariosService.obtenerTodos();
    }

    @Get(":id/reviews")
    async obtenerReviewsDeUsuario(@Param("id") id: string) {
        return await this.usuariosService.obtenerReviewsDeUsuario(Number(id));
    }
}
