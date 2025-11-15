import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Review } from "../reviews/review.entity";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    contrasena: string;

    @OneToMany(() => Review, (review: Review) => review.usuario)
    reviews: Review[];
}
