import { IsString, IsEnum, IsArray } from 'class-validator';
import { ComicItemDto } from './comic.item.dto';

export class ComicItemSingleDto extends ComicItemDto{
  @IsString()
  description: string;

  @IsEnum(['ongoing', 'completed'])
  status: 'ongoing' | 'completed';

  @IsEnum(['13+', '15+', '17+'])
  ageRating: '13+' | '15+' | '17+';

  @IsString()
  createdAt: string;

  @IsString()
  user: string;

  @IsArray()
  genres: string[];
}
