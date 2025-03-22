import { IsString, IsEnum, IsArray } from 'class-validator';

export class ComicItemSingleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['ongoing', 'completed'])
  status: 'ongoing' | 'completed';

  @IsEnum(['13+', '15+', '17+'])
  ageRating: '13+' | '15+' | '17+';

  @IsString()
  coverUrl: string;

  @IsString()
  createdAt: string;

  @IsString()
  user: string; // Автор комикса

  @IsArray()
  genres: string[]; // Список названий жанров
}
