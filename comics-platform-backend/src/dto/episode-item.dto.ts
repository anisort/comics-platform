import { IsDate, IsNumber, IsString } from "class-validator";

export class EpisodeItemDto {

    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    order: number;

    @IsDate()
    created_at: Date;
}