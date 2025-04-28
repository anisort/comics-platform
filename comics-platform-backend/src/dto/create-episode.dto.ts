import { IsNumber, IsString } from "class-validator";

export class CreateEpisodeDto {
  @IsString()
  name: string;

  @IsNumber()
  comicId: number;
}