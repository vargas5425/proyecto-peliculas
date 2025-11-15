import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pelicula } from "./pelicula.entity";
import { CreatePeliculaDto, UpdatePeliculaDto, PeliculaResponseDto } from "./dtos";

@Injectable()
export class PeliculasService {
    constructor(
        @InjectRepository(Pelicula)
        private peliculaRepo: Repository<Pelicula>,
    ) {}

    async findAll(): Promise<PeliculaResponseDto[]> {
        const peliculas = await this.peliculaRepo.find();
        return peliculas.map(pelicula => this.toResponseDto(pelicula));
    }

    async top20(): Promise<PeliculaResponseDto[]> {
        const peliculas = await this.peliculaRepo.find({
            order: { calificacionPromedio: "DESC" },
            take: 20,
        });
        return peliculas.map(pelicula => this.toResponseDto(pelicula));
    }

    async findOne(id: number): Promise<PeliculaResponseDto> {
        const pelicula = await this.peliculaRepo.findOne({
            where: { id },
            relations: ["reviews", "reviews.usuario"],
        });

        if (!pelicula) {
            throw new NotFoundException(`Película con ID ${id} no encontrada`);
        }

        return this.toResponseDto(pelicula);
    }

    async create(createPeliculaDto: CreatePeliculaDto): Promise<PeliculaResponseDto> {
        const existente = await this.peliculaRepo.findOne({
            where: { titulo: createPeliculaDto.titulo },
        });

        if (existente) {
            throw new ConflictException("La película ya existe");
        }

        const nueva = this.peliculaRepo.create(createPeliculaDto);
        const savedPelicula = await this.peliculaRepo.save(nueva);
        return this.toResponseDto(savedPelicula);
    }

    async update(id: number, updatePeliculaDto: UpdatePeliculaDto): Promise<PeliculaResponseDto> {
        const pelicula = await this.peliculaRepo.findOne({ where: { id } });

        if (!pelicula) {
            throw new NotFoundException(`Película con ID ${id} no encontrada`);
        }

        await this.peliculaRepo.update(id, updatePeliculaDto);
        const updatedPelicula = await this.peliculaRepo.findOne({
            where: { id },
            relations: ["reviews", "reviews.usuario"],
        });
        if (!updatedPelicula) {
            throw new NotFoundException(`Película con ID ${id} no encontrada después de actualizar`);
        }

        return this.toResponseDto(updatedPelicula);
    }

    async remove(id: number): Promise<void> {
        const pelicula = await this.peliculaRepo.findOne({ where: { id } });

        if (!pelicula) {
            throw new NotFoundException(`Película con ID ${id} no encontrada`);
        }

        await this.peliculaRepo.delete(id);
    }

    private toResponseDto(pelicula: Pelicula): PeliculaResponseDto {
        return {
            id: pelicula.id,
            titulo: pelicula.titulo,
            anio: pelicula.anio,
            imagen: pelicula.imagen,
            calificacionPromedio: pelicula.calificacionPromedio,
            reviews: pelicula.reviews,
        };
    }
}
