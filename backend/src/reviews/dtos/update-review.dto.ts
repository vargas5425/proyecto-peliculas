// reviews/dtos/update-review.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./create-review.dto";
import { Type } from "class-transformer";
import { IsNumber, Min, Max, IsOptional } from "class-validator";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 1 })
    @Min(1)
    @Max(10)
    puntuacion?: number;
}
