import { IsString } from 'class-validator';

export class ComicItemDto {
  @IsString()
  name: string;

  @IsString()
  coverUrl: string;

  @IsString()
  user: string;
}
