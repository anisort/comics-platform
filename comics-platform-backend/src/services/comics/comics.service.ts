import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comic } from '../../entities/comic.entity';
import { CreateComicDto } from '../../dto/create-comic.dto';
import { GenresService } from '../genres/genres.service';
import { Genre } from '../../entities/genre.entity';
import { UploadService } from '../upload/upload.service';
import { ComicItemDto } from 'src/dto/comic.item.dto';
import { ComicItemSingleDto } from 'src/dto/comic.single-item.dto';
import { UsersService } from '../users/users.service';
import { UpdateComicDto } from 'src/dto/update-comic.dto';

@Injectable()
export class ComicsService {
  constructor(
    @InjectRepository(Comic)
    private comicRepository: Repository<Comic>,
    private genresService: GenresService,
    private uploadService: UploadService,
    private usersService: UsersService
  ) {}

  async createComic(createComicDto: CreateComicDto,coverImage: Express.Multer.File): Promise<Comic | {errorMessage}> {
    const genres: Genre[] = await this.genresService.findByNames(createComicDto.genres);
    const user = await this.usersService.findUserByName(createComicDto.username);

    if (!user){
      return { errorMessage: 'User not found' };
    }

    let newComic = await this.comicRepository.create({
      name: createComicDto.name,
      description: createComicDto.description,
      status: createComicDto.status,
      ageRating: createComicDto.ageRating,
      coverUrl: "",
      user: { id: user.id, username: user.username},
      genres: genres,
    });

    newComic = await this.comicRepository.save(newComic);
    const folder = `comics-platform/comics/${newComic.id}/cover`;
    const coverResult = await this.uploadService.upload(coverImage, folder);
    newComic.coverUrl = coverResult.secure_url;

    return this.comicRepository.save(newComic);
}

  // async findAllComics(): Promise<ComicItemDto[] | {message}> {
  //   const comics = await this.comicRepository.find({ relations: ['user'] });

  //   if(comics.length == 0) return { message: "There are no comics in the system"};

  //   return comics.map(comic => ({
  //     name: comic.name,
  //     coverUrl: comic.coverUrl,
  //   }));
  // }

  async findAllComics(filters: { [key: string]: string }): Promise<ComicItemDto[] | { message: string }> {
    let where: any = {}; 

    if (filters.username) {
      const currentUser = await this.usersService.findUserByName(filters.username);
      if (!currentUser) {
        return { message: 'Author not found' };
      }
      console.log(currentUser)
      where.user = { id: currentUser.id };
    }
  
    if (filters.genre) {
      where.genre = filters.genre;
    }
  
    if (filters.year) {
      where.year = filters.year;
    }
  
    const comics = await this.comicRepository.find({
      relations: ['user'],
      where,
    });
  
    if (comics.length === 0) {
      return { message: "There are no comics in the system" };
    }
  
    return comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }
  

  async findComicById(id: number): Promise<ComicItemSingleDto | {errorMessage}> {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });
  
    if (!comic) {
      return { errorMessage: 'Comic not found' };
    }
  
    return {
      id: comic.id,
      name: comic.name,
      description: comic.description,
      status: comic.status,
      ageRating: comic.ageRating,
      coverUrl: comic.coverUrl,
      createdAt: comic.createdAt.getFullYear().toString(),
      user: comic.user.username,
      genres: comic.genres.map(genre => genre.name),
    };
  }

  async updateComic(id: number, updateComicDto: UpdateComicDto, newCoverImage?: Express.Multer.File) : Promise<Comic| {errorMessage}>{
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });

    if (!comic) {
      return { errorMessage: 'Comic not found' };
    }

    if (updateComicDto.genres !== undefined) {
      const newGenres: Genre[] = await this.genresService.findByNames(updateComicDto.genres);
      comic.genres = newGenres;
    }

    if (updateComicDto.name !== undefined){
      comic.name = updateComicDto.name;
    }

    if (updateComicDto.description !== undefined){
      comic.description = updateComicDto.description;
    }

    if (updateComicDto.status !== undefined){
      comic.status = updateComicDto.status;
    }

    if(updateComicDto.ageRating !== undefined){
      comic.ageRating = updateComicDto.ageRating;
    }
    
    if (newCoverImage) {
      const publicId = (comic.coverUrl).split('/').pop()?.split('.')[0];
      const valueToDelete = `comics-platform/comics/${comic.id}/cover/${publicId}`
      await this.uploadService.deleteCoverFromCloudinary(valueToDelete);

      const folder = `comics-platform/comics/${comic.id}/cover`;
      const coverResult = await this.uploadService.upload(newCoverImage, folder);

      comic.coverUrl = coverResult.secure_url;
    }
    const updatedComic = await this.comicRepository.save(comic);
    return {
      ...updatedComic,
      user: { id: updatedComic.user.id, username: updatedComic.user.username },
    };
  }

  async deleteComic(id: number){
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });

    if (!comic) {
      return { errorMessage: 'Comic not found' };
    }

    await this.comicRepository.remove(comic);
    const valueToDelete = `comics-platform/comics/${comic.id}`
    await this.uploadService.deleteCoverFromCloudinary(valueToDelete);

  }

  // async getComicsByAuthor(currentUsername: string): Promise<ComicItemDto[] | { errorMessage }> {
  //   console.log('Username:', currentUsername);
    
  //   const currentUser = await this.usersService.findUserByName(currentUsername);
  //   if (!currentUser) {
  //     console.log('User not found');
  //     return { errorMessage: 'User not found' };
  //   }
    
  //   console.log('User found:', currentUser);
    
  //   const comics = await this.comicRepository.find({
  //     relations: ['user'],
  //     where: { user: { id: currentUser.id } },
  //   });
  
  //   console.log('Comics found:', comics);
    
  //   return comics.map(comic => ({
  //     name: comic.name,
  //     coverUrl: comic.coverUrl,
  //   }));
  // }
  
  
  
}
