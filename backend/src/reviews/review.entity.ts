import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Pelicula } from "../peliculas/pelicula.entity";
import { Usuario } from "../usuarios/usuario.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texto: string;

    @Column({ type: "int" })
    puntuacion: number;

    @ManyToOne(() => Pelicula, pelicula => pelicula.reviews)
    pelicula: Pelicula;

    @ManyToOne(() => Usuario, usuario => usuario.reviews)
    usuario: Usuario;
}
