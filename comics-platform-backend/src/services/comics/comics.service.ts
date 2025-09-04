import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
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
    private usersService: UsersService,
  ) {}

  async findAllComics(
    page: number,
    limit: number,
  ): Promise<{ comics: ComicItemDto[]; total: number; totalPages: number }> {
    const [comics, total] = await this.comicRepository.findAndCount({
      relations: ['user'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      comics: comics.map((comic) => ({
        id: comic.id,
        name: comic.name,
        coverUrl: comic.coverUrl,
      })),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTopComicsByLatestEpisode(): Promise<ComicItemDto[]> {
    const rawComics = await this.comicRepository
      .createQueryBuilder('comic')
      .leftJoin('comic.episodes', 'episode')
      .where('episode.isAvailable = true')
      .select([
        'comic.id AS comic_id',
        'MAX(episode.created_at) AS latestEpisodeDate',
      ])
      .groupBy('comic.id')
      .orderBy('latestEpisodeDate', 'DESC')
      .limit(9)
      .getRawMany();

    const comicIds = rawComics.map((row: { comic_id: number }) => row.comic_id);

    if (!comicIds.length) return [];

    const comics = await this.comicRepository.find({
      where: { id: In(comicIds) },
    });

    const comicMap = new Map(comics.map((c) => [c.id, c]));
    const sortedComics = comicIds
      .map((id) => comicMap.get(id))
      .filter((comic): comic is Comic => comic !== undefined);

    return sortedComics.map((comic) => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
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
      genres: comic.genres.map((genre) => genre.name),
    };
  }

  async searchComics(searchQuery: string): Promise<ComicItemDto[]> {
    if (!searchQuery) return [];

    const comics = await this.comicRepository.find({
      where: { name: ILike(`%${searchQuery}%`) },
      take: 5,
    });

    return comics.map((comic) => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }

  async getComicsByUserId(userId: number): Promise<ComicItemDto[]> {
    const currentUser = await this.usersService.findUserById(userId);
    if (!currentUser) {
      throw new UnauthorizedException();
    }

    const comics = await this.comicRepository.find({
      relations: ['user'],
      where: { user: { id: currentUser.id } },
    });

    return comics.map((comic) => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }

  async createComic(
    createComicDto: CreateComicDto,
    coverImage: Express.Multer.File,
    username: string,
  ): Promise<Comic> {
    const genres: Genre[] = await this.genresService.findByNames(
      createComicDto.genres,
    );
    const user = await this.usersService.findUserByName(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let newComic = this.comicRepository.create({
      name: createComicDto.name,
      description: createComicDto.description,
      status: createComicDto.status,
      ageRating: createComicDto.ageRating,
      coverUrl: '',
      user: { id: user.id, username: user.username },
      genres: genres,
    });

    newComic = await this.comicRepository.save(newComic);
    const folder = `comics-platform/comics/covers`;
    const coverResult = await this.uploadService.upload(coverImage, folder);
    newComic.coverUrl = coverResult.secure_url;

    return await this.comicRepository.save(newComic);
  }

  async updateComic(
    id: number,
    updateComicDto: UpdateComicDto,
    username: string,
    newCoverImage?: Express.Multer.File,
  ): Promise<Comic> {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres'],
    });

    if (!comic || comic.user.username !== username) {
      throw new NotFoundException('Comic not found');
    }

    if (updateComicDto.genres !== undefined) {
      comic.genres = await this.genresService.findByNames(
        updateComicDto.genres,
      );
    }

    if (updateComicDto.name !== undefined) {
      comic.name = updateComicDto.name;
    }

    if (updateComicDto.description !== undefined) {
      comic.description = updateComicDto.description;
    }

    if (updateComicDto.status !== undefined) {
      comic.status = updateComicDto.status;
    }

    if (updateComicDto.ageRating !== undefined) {
      comic.ageRating = updateComicDto.ageRating;
    }

    if (newCoverImage) {
      const publicId = comic.coverUrl.split('/').pop()?.split('.')[0];
      const valueToDelete = `comics-platform/comics/covers/${publicId}`;
      await this.uploadService.delete(valueToDelete);

      const folder = `comics-platform/comics/covers`;
      const coverResult = await this.uploadService.upload(
        newCoverImage,
        folder,
      );

      comic.coverUrl = coverResult.secure_url;
    }
    const updatedComic = await this.comicRepository.save(comic);
    return {
      ...updatedComic,
      user: { id: updatedComic.user.id, username: updatedComic.user.username },
    };
  }

  async deleteComic(id: number, username: string) {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user', 'genres', 'episodes', 'episodes.pages'],
    });

    if (!comic || comic.user.username !== username) {
      throw new NotFoundException('Comic not found');
    }

    await this.comicRepository.remove(comic);

    const pageUrls = comic.episodes.flatMap((episode) =>
      episode.pages.map((page) => page.imageUrl),
    );
    await this.uploadService.deleteComicFromCloudService(
      comic.coverUrl,
      pageUrls,
    );
  }

  async isNameTaken(name: string): Promise<boolean> {
    return this.comicRepository.exists({ where: { name } });
  }

  async isAuthor(id: number, username: string): Promise<{ isAuthor: boolean }> {
    const comic = await this.comicRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comic || comic.user.username !== username) {
      return { isAuthor: false };
    } else {
      return { isAuthor: true };
    }
  }

  async findComicEntityByIdWithSubscribers(comicId: number): Promise<Comic> {
    const comic = await this.comicRepository.findOne({
      where: { id: comicId },
      relations: ['subscribers'],
    });

    if (!comic) {
      throw new NotFoundException('Comic not found');
    }

    return comic;
  }

  async findComicEntityByIdWithAuthor(comicId: number): Promise<Comic> {
    const comic = await this.comicRepository.findOne({
      where: { id: comicId },
      relations: ['user'],
    });

    if (!comic) {
      throw new NotFoundException('Comic not found');
    }

    return comic;
  }
}
