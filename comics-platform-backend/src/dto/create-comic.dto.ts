import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateComicDto {
  @IsString()
  @IsNotEmpty()
  //@IsUnique({tableName: 'comics', column: 'name'})
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['ongoing', 'completed'])
  status: 'ongoing' | 'completed';

  @IsEnum(['13+', '16+', '18+'])
  ageRating: '13+' | '16+' | '18+';

  @IsString({ each: true })
  genres: string[] | string;
}
