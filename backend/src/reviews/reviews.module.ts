import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Pelicula } from "../peliculas/pelicula.entity";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { PeliculasModule } from "../peliculas/peliculas.module";
import { UsuariosModule } from "../usuarios/usuarios.module";

@Module({
    imports: [TypeOrmModule.forFeature([Review, Pelicula]), PeliculasModule, UsuariosModule],
    providers: [ReviewsService],
    controllers: [ReviewsController],
})
export class ReviewsModule {}
