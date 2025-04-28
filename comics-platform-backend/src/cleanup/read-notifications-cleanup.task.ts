import { CleanupTask } from './cleanup-task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReadNotificationsCleanupTask implements CleanupTask {
  private readonly logger = new Logger(ReadNotificationsCleanupTask.name);

  constructor(
    @InjectRepository(Notification) private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async cleanup(): Promise<void> {
    this.logger.log('Starting read notifications cleanup job...');

    const notifications = await this.notificationsRepository.find({ where: { isRead: true } });
    this.logger.log(`Found ${notifications.length} read notifications.`);

    const now = Date.now();
    const cutoffInMilliseconds = 185 * 60 * 1000;

    const expired = notifications.filter(n => (now - new Date(n.createdAt).getTime()) > cutoffInMilliseconds);
    this.logger.log(`Notifications eligible for deletion: ${expired.length}`);

    if (expired.length > 0) {
      await this.notificationsRepository.remove(expired);
      this.logger.log(`Deleted ${expired.length} read notifications.`);
    } else {
      this.logger.log('No read notifications to delete at this time.');
    }

    this.logger.log('Read notifications cleanup job finished.');
  }
}
