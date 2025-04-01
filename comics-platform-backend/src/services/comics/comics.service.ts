import { Injectable, NotFoundException, Request, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

  async findAllComics(filters: { [key: string]: string }, page: number, limit: number): Promise<{ comics: ComicItemDto[], total: number, totalPages: number }> {
    let where: any = {};

    if (filters.genre) {
      where.genre = filters.genre;
    }
    if (filters.year) {
      where.year = filters.year;
    }
    const [comics, total] = await this.comicRepository.findAndCount({
      relations: ['user'],
      where,
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      comics: comics.map(comic => ({
        id: comic.id,
        name: comic.name,
        coverUrl: comic.coverUrl,
      })),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findComicById(id: number): Promise<ComicItemSingleDto | null> {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });
  
    if (!comic) {
      return null;
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

  async searchComics(searchQuery: string): Promise<ComicItemDto[]> {
    if (!searchQuery) return [];
  
    const comics = await this.comicRepository.find({
      where: { name: ILike(`%${searchQuery}%`) },
      relations: ['user'],
      take: 5,
    });
  
    return comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }
  

  async createComic(createComicDto: CreateComicDto,coverImage: Express.Multer.File): Promise<Comic | {errorMessage : string}> {
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

  async updateComic(id: number, updateComicDto: UpdateComicDto, newCoverImage?: Express.Multer.File) : Promise<Comic| {errorMessage : string}>{
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
      await this.uploadService.delete(valueToDelete);

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

    // const publicId = (comic.coverUrl).split('/').pop()?.split('.')[0];
    // console.log(publicId, " ", id)
    // const valueToDelete = `comics-platform/comics/${id}/cover/${publicId}`
    // await this.uploadService.delete(valueToDelete);

  }

  async getComicsByUsername(currentUsername: string): Promise<ComicItemDto[]> {
    
    const currentUser = await this.usersService.findUserByName(currentUsername);
    if (!currentUser) {
      throw NotFoundException;
    }
    
    const comics = await this.comicRepository.find({
      relations: ['user'],
      where: { user: { id: currentUser.id } },
    });
    
    return comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }
  
}





// async findAllComics(filters: { [key: string]: string }, page?: number, limit?: number): Promise<{ comics: ComicItemDto[], total: number, totalPages?: number }> {
//   let where: any = {};

//   if (filters.genre) {
//     where.genre = filters.genre;
//   }
//   if (filters.year) {
//     where.year = filters.year;
//   }


//   if (page && limit) {
//     const [comics, total] = await this.comicRepository.findAndCount({
//       relations: ['user'],
//       where,
//       take: limit,
//       skip: (page - 1) * limit,
//     });

//     return {
//       comics: comics.map(comic => ({
//         id: comic.id,
//         name: comic.name,
//         coverUrl: comic.coverUrl,
//       })),
//       total,
//       totalPages: Math.ceil(total / limit),
//     };
//   } else {
//     const comics = await this.comicRepository.find({
//       relations: ['user'],
//       where,
//     });

//     return {
//       comics: comics.map(comic => ({
//         id: comic.id,
//         name: comic.name,
//         coverUrl: comic.coverUrl,
//       })),
//       total: comics.length,
//     };
//   }
// }

  