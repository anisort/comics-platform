import { CleanupFactory } from './cleanup.factory';
import { ReadNotificationsCleanupTask } from './read-notifications-cleanup.task';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsCleanupFactory extends CleanupFactory {
  constructor(
    private readonly readNotificationsCleanupTask: ReadNotificationsCleanupTask,
  ) {
    super();
  }

  createCleanupTask() {
    return this.readNotificationsCleanupTask;
  }
}