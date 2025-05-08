import { Injectable, Inject } from '@nestjs/common';
import { SubscriptionService } from '../subscription/subscription.service';
import { NotificationType } from 'src/entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import { Comic } from 'src/entities/comic.entity';
import { Episode } from 'src/entities/episode.entity';
import { Subscriber, SUBSCRIBERS } from 'src/observers/subscriber.interface';

@Injectable()
export class EpisodeNotificationService {
  constructor(
    @Inject(SUBSCRIBERS)
    private readonly subscribers: Subscriber[],
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  async notifySubscribersAboutNewEpisode(comic: Comic, episode: Episode): Promise<void> {
    const users = await this.subscriptionService.getSubscribers(comic.id);
    if (!users.length) return;

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const link = `${frontendUrl}/read/${episode.id}?page=1`;

    for (const subscriber of this.subscribers) {
      for (const user of users) {
        await subscriber.update({
          user,
          title: comic.name,
          message: `New episode "${episode.name}" released!`,
          type: NotificationType.NEW_EPISODE,
          link,
          coverUrl: comic.coverUrl,
        });
      }
    }
  }
}

