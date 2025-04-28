import { CleanupFactory } from './cleanup.factory';
import { ReadNotificationsCleanupTask } from './read-notifications-cleanup.task';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsCleanupFactory extends CleanupFactory {
  constructor(private readonly task: ReadNotificationsCleanupTask) {
    super();
  }

  createCleanupTask() {
    return this.task;
  }
}
