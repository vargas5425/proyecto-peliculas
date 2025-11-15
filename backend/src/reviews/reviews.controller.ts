import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto } from "./dtos";

@Controller("reviews")
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    async getAll(): Promise<ReviewResponseDto[]> {
        return this.reviewsService.findAll();
    }

    @Get("pelicula/:id")
    async getByPelicula(@Param("id") id: number): Promise<ReviewResponseDto[]> {
        return this.reviewsService.findByPelicula(id);
    }

    @Post()
    async create(@Body() createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
        return this.reviewsService.create(createReviewDto);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto> {
        return this.reviewsService.update(id, updateReviewDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: number): Promise<{ message: string }> {
        return this.reviewsService.remove(id);
    }
}
