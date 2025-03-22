// comics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comic } from '../../entities/comic.entity';
import { ComicCreateDto } from '../../dto/comic.create.dto';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../../entities/genre.entity';
import { UploadService } from '../upload/upload.service'; // Для загрузки обложки
import { ComicItemDto } from 'src/dto/comic.item.dto';
import { ComicItemSingleDto } from 'src/dto/comic.single-item.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ComicsService {
  constructor(
    @InjectRepository(Comic)
    private comicRepository: Repository<Comic>,
    private genresService: GenresService,
    private uploadService: UploadService,
    private usersService: UsersService
  ) {}

  async createComic(
    createComicDto: ComicCreateDto,
    coverImage: Express.Multer.File,
  ): Promise<Comic> {
    const genres: Genre[] = await this.genresService.findByNames(createComicDto.genres);
    const coverResult = await this.uploadService.uploadCover(coverImage, createComicDto.name);
    const user = await this.usersService.findUserByName(createComicDto.username);
    const userId = user?.id;
    const newComic = this.comicRepository.create({
      name: createComicDto.name,
      description: createComicDto.description,
      status: createComicDto.status,
      ageRating: createComicDto.ageRating,
      coverUrl: coverResult.secure_url,
      user: { id: userId },
      genres: genres,
    });

    return this.comicRepository.save(newComic);
  }

  async findAll(): Promise<ComicItemDto[]> {
    const comics = await this.comicRepository.find({ relations: ['user'] });

    return comics.map(comic => ({
      name: comic.name,
      coverUrl: comic.coverUrl,
      user: comic.user.username,
    }));
  }

  async findOne(id: number): Promise<ComicItemSingleDto> {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });
  
    if (!comic) {
      throw new Error('Comic not found');
    }
  
    return {
      name: comic.name,
      description: comic.description,
      status: comic.status,
      ageRating: comic.ageRating,
      coverUrl: comic.coverUrl,
      createdAt: comic.createdAt.toISOString(),
      user: comic.user.username,
      genres: comic.genres.map(genre => genre.name),
    };
  }
  
}
