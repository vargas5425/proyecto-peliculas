import { PartialType } from "@nestjs/mapped-types";
import { CreatePeliculaDto } from "./create-peliculas.dto";

export class UpdatePeliculaDto extends PartialType(CreatePeliculaDto) {}
