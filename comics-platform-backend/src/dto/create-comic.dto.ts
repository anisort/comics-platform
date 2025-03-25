import { IsNotEmpty, IsString, IsEnum, IsArray } from 'class-validator';

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

  @IsEnum(['13+', '15+', '17+'])
  ageRating: '13+' | '15+' | '17+';

  @IsString()
  @IsNotEmpty()
  username: string;

  //@IsArray()
  @IsString({ each: true })
  genres: string[] | string;
}
