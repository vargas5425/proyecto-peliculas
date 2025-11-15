import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PeliculasModule } from "./peliculas/peliculas.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { Usuario } from "./usuarios/usuario.entity";
import { Pelicula } from "./peliculas/pelicula.entity";
import { Review } from "./reviews/review.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "peliculas.db",
            entities: [Usuario, Pelicula, Review],
            synchronize: true, // crea tablas automáticamente
        }),
        PeliculasModule,
        ReviewsModule,
        UsuariosModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
