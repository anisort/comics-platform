import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { NotificationType } from 'src/entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import { Comic } from 'src/entities/comic.entity';
import { Episode } from 'src/entities/episode.entity';
import { Subscriber } from 'src/observers/subscriber.interface';

@Injectable()
export class EpisodeNotificationService {
  private subscribers: Subscriber[];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {
    this.subscribers = [this.notificationsService];
  }

  async notifySubscribersAboutNewEpisode(comic: Comic, episode: Episode): Promise<void> {
    const users = await this.subscriptionService.getSubscribers(comic.id);

    if (!users.length) {
      return;
    }

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

