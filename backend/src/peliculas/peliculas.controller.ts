// peliculas.controller.ts
import { Controller, Get, Post, Param, Body, Put, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { PeliculasService } from "./peliculas.service";
import { CreatePeliculaDto, UpdatePeliculaDto, PeliculaResponseDto } from "./dtos";

@Controller("peliculas")
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PeliculasController {
    constructor(private readonly peliculasService: PeliculasService) {}

    @Get("top")
    async getTop20(): Promise<PeliculaResponseDto[]> {
        return this.peliculasService.top20();
    }

    @Get(":id")
    async getOne(@Param("id") id: number): Promise<PeliculaResponseDto> {
        return this.peliculasService.findOne(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor("imagen", {
            storage: diskStorage({
                destination: "./public/images",
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `pelicula-${uniqueSuffix}${ext}`;
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype.match(/\/(jpg|jpeg|png|jfif|gif|webp)$/)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException("Solo se permiten imágenes (jpg, jpeg, png, gif, webp)"), false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async create(@UploadedFile() imagen: Express.Multer.File, @Body() createPeliculaDto: CreatePeliculaDto): Promise<PeliculaResponseDto> {
        if (!imagen) {
            throw new BadRequestException("La imagen es requerida");
        }

        const peliculaData = {
            ...createPeliculaDto,
            imagen: imagen.filename,
            calificacionPromedio: 0,
        };

        return this.peliculasService.create(peliculaData);
    }

    @Get()
    async getAll(): Promise<PeliculaResponseDto[]> {
        return this.peliculasService.findAll();
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() updatePeliculaDto: UpdatePeliculaDto): Promise<PeliculaResponseDto> {
        return this.peliculasService.update(id, updatePeliculaDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: number): Promise<void> {
        return this.peliculasService.remove(id);
    }
}
