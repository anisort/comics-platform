import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { InactiveUsersCleanupTask } from './inactive-users-cleanup.task';
import { ReadNotificationsCleanupTask } from './read-notifications-cleanup.task';
import { UsersCleanupFactory } from './users-cleanup.factory';
import { NotificationsCleanupFactory } from './notifications-cleanup.factory';
import { CleanupService } from './cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  providers: [
    InactiveUsersCleanupTask,
    ReadNotificationsCleanupTask,
    UsersCleanupFactory,
    NotificationsCleanupFactory,
    {
      provide: 'CleanupFactoryArray',
      useFactory: (
        usersCleanupFactory: UsersCleanupFactory,
        notificationsCleanupFactory: NotificationsCleanupFactory,
      ) => [usersCleanupFactory, notificationsCleanupFactory],
      inject: [UsersCleanupFactory, NotificationsCleanupFactory],
    },
    CleanupService,
  ],
  exports: [CleanupService],
})
export class CleanupModule {}
