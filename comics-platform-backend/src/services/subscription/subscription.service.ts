import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/services/users/users.service';
import { ComicsService } from 'src/services/comics/comics.service';
import { User } from 'src/entities/user.entity';
import { ComicItemDto } from 'src/dto/comic.item.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly usersService: UsersService,
    private readonly comicsService: ComicsService,
  ) {}

  async subscribe(userId: number, comicId: number) {
    const user = await this.usersService.findUserByIdWithSubscriptions(userId);
    const comic =
      await this.comicsService.findComicEntityByIdWithAuthor(comicId);

    if (user && comic) {
      if (comic.user.id === user.id) {
        throw new NotFoundException('You cannot subscribe to your own comic');
      }

      if (!user.subscribedComics.find((c) => c.id === comic.id)) {
        user.subscribedComics.push(comic);
        await this.usersService.saveUser(user);
      }
    }
  }

  async unsubscribe(userId: number, comicId: number) {
    const user = await this.usersService.findUserByIdWithSubscriptions(userId);
    if (user) {
      user.subscribedComics = user.subscribedComics.filter(
        (c) => c.id !== comicId,
      );
      await this.usersService.saveUser(user);
    }
  }

  async getSubscribers(comicId: number): Promise<User[]> {
    const comic =
      await this.comicsService.findComicEntityByIdWithSubscribers(comicId);
    return comic?.subscribers || [];
  }

  async getUserSubscriptions(userId: number): Promise<ComicItemDto[]> {
    const user = await this.usersService.findUserByIdWithSubscriptions(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.subscribedComics.map((comic) => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
    }));
  }

  async isSubscribed(userId: number, comicId: number): Promise<boolean> {
    const user = await this.usersService.findUserByIdWithSubscriptions(userId);
    if (user) {
      return user.subscribedComics.some((c) => c.id === comicId);
    }
    return false;
  }
}
