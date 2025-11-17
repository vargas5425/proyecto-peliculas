/*
// backend/src/seed-peliculas.ts
import { Pelicula } from "./peliculas/pelicula.entity";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const peliculaRepo = appContext.get<Repository<Pelicula>>(getRepositoryToken(Pelicula));

    const peliculas: Partial<Pelicula>[] = [
        {
            titulo: "El Padrino",
            anio: 1972,
            calificacionPromedio: 9.2,
            imagen: "/images/padrino.jfif",
        },
        {
            titulo: "The Dark Knight",
            anio: 2008,
            calificacionPromedio: 9.0,
            imagen: "/images/batman.jfif",
        },
        {
            titulo: "Cars",
            anio: 2006,
            calificacionPromedio: 8.9,
            imagen: "/images/cars.jfif",
        },
        {
            titulo: "Forrest Gump",
            anio: 1994,
            calificacionPromedio: 8.8,
            imagen: "/images/forest.jfif",
        },
        {
            titulo: "Inception",
            anio: 2010,
            calificacionPromedio: 8.7,
            imagen: "/images/inception.jfif",
        },
        {
            titulo: "Monsters Inc.",
            anio: 2001,
            calificacionPromedio: 8.7,
            imagen: "/images/boo.jfif",
        },
        {
            titulo: "The Matrix",
            anio: 1999,
            calificacionPromedio: 8.7,
            imagen: "/images/matrix.jfif",
        },
        {
            titulo: "The Lord of the Rings: The Return of the King",
            anio: 2003,
            calificacionPromedio: 8.9,
            imagen: "/images/lord.jfif",
        },
        {
            titulo: "Star Wars: Episode V - The Empire Strikes Back",
            anio: 1980,
            calificacionPromedio: 8.7,
            imagen: "/images/star.jfif",
        },
        {
            titulo: "Interstellar",
            anio: 2014,
            calificacionPromedio: 8.6,
            imagen: "/images/inter.jfif",
        },
        {
            titulo: "Gladiator",
            anio: 2000,
            calificacionPromedio: 8.5,
            imagen: "/images/gla.jfif",
        },
        {
            titulo: "Kung Fu Panda",
            anio: 2008,
            calificacionPromedio: 9.3,
            imagen: "/images/panda.jfif",
        },
        {
            titulo: "The Lion King",
            anio: 1994,
            calificacionPromedio: 8.5,
            imagen: "/images/lion.jfif",
        },
        {
            titulo: "Jurassic Park",
            anio: 1993,
            calificacionPromedio: 8.1,
            imagen: "/images/park.jfif",
        },
        {
            titulo: "The Avengers",
            anio: 2012,
            calificacionPromedio: 8.0,
            imagen: "/images/vengadores.jfif",
        },
        {
            titulo: "Titanic",
            anio: 1997,
            calificacionPromedio: 7.8,
            imagen: "/images/titanic.jfif",
        },
        {
            titulo: "Toy Story",
            anio: 1995,
            calificacionPromedio: 8.3,
            imagen: "/images/toy.jfif",
        },
        {
            titulo: "Finding Nemo",
            anio: 2003,
            calificacionPromedio: 8.1,
            imagen: "/images/nemo.jfif",
        },
        {
            titulo: "Back to the Future",
            anio: 1985,
            calificacionPromedio: 8.5,
            imagen: "/images/futuro.jfif",
        },
        {
            titulo: "The Silence of the Lambs",
            anio: 1991,
            calificacionPromedio: 8.6,
            imagen: "/images/silencio.jfif",
        },
    ];

    let agregadas = 0;
    let existentes = 0;

    for (const peliculaData of peliculas) {
        const existe = await peliculaRepo.findOne({
            where: { titulo: peliculaData.titulo },
        });

        if (!existe) {
            const nuevaPelicula = peliculaRepo.create(peliculaData);
            await peliculaRepo.save(nuevaPelicula);
            console.log(`✅ Agregada: ${peliculaData.titulo}`);
            agregadas++;
        } else {
            console.log(`⚠️  Ya existe: ${peliculaData.titulo}`);
            existentes++;
        }
    }

    console.log(`\nSeed finalizado ✅`);
    console.log(`Agregadas: ${agregadas}`);
    console.log(`Existentes: ${existentes}`);
    console.log(`Total en BD: ${await peliculaRepo.count()}`);

    await appContext.close();
}

bootstrap();*/
