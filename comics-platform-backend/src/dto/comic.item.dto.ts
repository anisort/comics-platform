import { IsNumber, IsString } from 'class-validator';

export class ComicItemDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  coverUrl: string;
}
