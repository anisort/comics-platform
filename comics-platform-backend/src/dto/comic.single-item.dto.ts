import { IsString, IsEnum, IsArray } from 'class-validator';
import { ComicItemDto } from './comic.item.dto';

export class ComicItemSingleDto extends ComicItemDto{
  @IsString()
  description: string;

  @IsEnum(['ongoing', 'completed'])
  status: 'ongoing' | 'completed';

  @IsEnum(['13+', '16+', '18+'])
  ageRating: '13+' | '16+' | '18+';

  @IsString()
  createdAt: string;

  @IsString()
  user: string;

  @IsArray()
  genres: string[];
}
