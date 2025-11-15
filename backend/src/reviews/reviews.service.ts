import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity";
import { Pelicula } from "../peliculas/pelicula.entity";
import { PeliculasService } from "../peliculas/peliculas.service";
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto } from "./dtos";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>,
        @InjectRepository(Pelicula)
        private peliculaRepo: Repository<Pelicula>,
        private peliculasService: PeliculasService,
    ) {}

    async findAll(): Promise<ReviewResponseDto[]> {
        const reviews = await this.reviewRepo.find({
            relations: ["pelicula", "usuario"],
        });
        return reviews.map(review => this.toResponseDto(review));
    }

    async findByPelicula(id: number): Promise<ReviewResponseDto[]> {
        const reviews = await this.reviewRepo.find({
            where: { pelicula: { id } },
            relations: ["pelicula", "usuario"],
        });
        return reviews.map(review => this.toResponseDto(review));
    }

    async create(createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
        // Verificar si el usuario ya hizo review para esta película
        const existeReview = await this.reviewRepo.findOne({
            where: {
                usuario: { id: createReviewDto.usuario.id },
                pelicula: { id: createReviewDto.pelicula.id },
            },
        });

        if (existeReview) {
            throw new ConflictException("Ya existe una review de este usuario para esta película");
        }

        const review = this.reviewRepo.create({
            texto: createReviewDto.texto,
            puntuacion: createReviewDto.puntuacion,
            pelicula: { id: createReviewDto.pelicula.id },
            usuario: { id: createReviewDto.usuario.id },
        });

        const saved = await this.reviewRepo.save(review);

        // Cargar relaciones completas
        const reviewConRelaciones = await this.reviewRepo.findOne({
            where: { id: saved.id },
            relations: ["pelicula", "usuario"],
        });

        if (!reviewConRelaciones) {
            throw new NotFoundException("No se pudo cargar la reseña con relaciones");
        }

        // Recalcular promedio
        await this.recalcularPromedioPelicula(createReviewDto.pelicula.id);

        return this.toResponseDto(reviewConRelaciones);
    }

    async update(id: number, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto> {
        const review = await this.reviewRepo.findOne({ where: { id } });

        if (!review) {
            throw new NotFoundException(`Review con ID ${id} no encontrada`);
        }

        await this.reviewRepo.update(id, updateReviewDto);

        const updatedReview = await this.reviewRepo.findOne({
            where: { id },
            relations: ["pelicula", "usuario"],
        });

        if (!updatedReview) {
            throw new NotFoundException(`Review con ID ${id} no encontrada después de actualizar`);
        }

        // Recalcular promedio si cambió la puntuación
        if (updateReviewDto.puntuacion !== undefined) {
            await this.recalcularPromedioPelicula(updatedReview.pelicula.id);
        }

        return this.toResponseDto(updatedReview);
    }

    async remove(id: number): Promise<{ message: string }> {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ["pelicula"],
        });

        if (!review) {
            throw new NotFoundException("Review no encontrada");
        }

        const peliculaId = review.pelicula.id;
        await this.reviewRepo.delete(id);

        // Recalcular promedio después de eliminar
        await this.recalcularPromedioPelicula(peliculaId);

        return { message: "Review eliminada" };
    }

    private async recalcularPromedioPelicula(peliculaId: number): Promise<void> {
        const reviews = await this.findByPelicula(peliculaId);
        const promedio = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.puntuacion, 0) / reviews.length : 0;

        await this.peliculaRepo.update(peliculaId, { calificacionPromedio: promedio });
    }

    private toResponseDto(review: Review): ReviewResponseDto {
        return {
            id: review.id,
            texto: review.texto,
            puntuacion: review.puntuacion,
            pelicula: {
                id: review.pelicula.id,
                titulo: review.pelicula.titulo,
                anio: review.pelicula.anio,
                imagen: review.pelicula.imagen,
                calificacionPromedio: review.pelicula.calificacionPromedio,
            },
            usuario: {
                id: review.usuario.id,
                nombre: review.usuario.nombre,
                correo: review.usuario.correo,
            },
        };
    }
}
