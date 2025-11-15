import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Review } from "../reviews/review.entity";

@Entity()
export class Pelicula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    anio: number;

    @Column()
    imagen: string;

    @Column({ type: "float", default: 0 })
    calificacionPromedio: number;

    @OneToMany(() => Review, review => review.pelicula)
    reviews: Review[];
}
