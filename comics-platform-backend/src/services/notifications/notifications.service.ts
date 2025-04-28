import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
import { NotificationContext, Subscriber } from 'src/observers/subscriber.interface';

@Injectable()
export class NotificationsService implements Subscriber{
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async update(context: NotificationContext): Promise<void> {
    const { user, title, message, type, link, coverUrl } = context;
    const notification = this.notificationRepository.create({
      user,
      title,
      message,
      type,
      link,
      notificationCoverUrl: coverUrl,
    });
    await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number) {
    return await this.notificationRepository.find({
      where: { user: { id: userId }, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
    });

    if (notification) {
      notification.isRead = true;
      return await this.notificationRepository.save(notification);
    }

    return null;
  }

  async markAllAsRead(userId: number) {
    const unreadNotifications = await this.notificationRepository.find({
      where: { user: { id: userId }, isRead: false },
    });

    for (const notification of unreadNotifications) {
      notification.isRead = true;
    }

    await this.notificationRepository.save(unreadNotifications);

    return { message: `Marked ${unreadNotifications.length} notifications as read` };
  }
}
