import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Usuario } from "./usuario.entity";
import { CreateUsuarioDto, LoginUsuarioDto, UsuarioResponseDto } from "./dto";

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepo: Repository<Usuario>,
    ) {}

    async registrar(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
        // Verificar si el correo ya existe
        const existeUsuario = await this.usuariosRepo.findOne({
            where: { correo: createUsuarioDto.correo },
        });

        if (existeUsuario) {
            throw new ConflictException("El correo ya está registrado");
        }

        // El frontend ya encriptó la contraseña, la guardamos directamente
        const usuario = this.usuariosRepo.create({
            nombre: createUsuarioDto.nombre,
            correo: createUsuarioDto.correo,
            contrasena: createUsuarioDto.password, // ← Usar password del DTO
        });

        const savedUsuario = await this.usuariosRepo.save(usuario);
        return this.toResponseDto(savedUsuario);
    }

    async login(loginUsuarioDto: LoginUsuarioDto): Promise<UsuarioResponseDto> {
        const usuario = await this.usuariosRepo.findOneBy({
            correo: loginUsuarioDto.correo,
            contrasena: loginUsuarioDto.contrasena, // ← El frontend ya encriptó
        });

        if (!usuario) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        return this.toResponseDto(usuario);
    }

    async obtenerTodos(): Promise<UsuarioResponseDto[]> {
        const usuarios = await this.usuariosRepo.find();
        return usuarios.map(usuario => this.toResponseDto(usuario));
    }

    async obtenerReviewsDeUsuario(id: number) {
        return this.usuariosRepo.findOne({
            where: { id },
            relations: ["reviews", "reviews.pelicula"],
        });
    }

    private toResponseDto(usuario: Usuario): UsuarioResponseDto {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
        };
    }
}
