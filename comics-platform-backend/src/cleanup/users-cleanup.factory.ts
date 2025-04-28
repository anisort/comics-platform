import { CleanupFactory } from './cleanup.factory';
import { InactiveUsersCleanupTask } from './inactive-users-cleanup.task';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersCleanupFactory extends CleanupFactory {
  constructor(private readonly task: InactiveUsersCleanupTask) {
    super();
  }

  createCleanupTask() {
    return this.task;
  }
}
