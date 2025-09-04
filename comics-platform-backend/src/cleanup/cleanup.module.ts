import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { InactiveUsersCleanupTask } from './inactive-users-cleanup.task';
import { ReadNotificationsCleanupTask } from './read-notifications-cleanup.task';
import { UsersCleanupFactory } from './users-cleanup.factory';
import { NotificationsCleanupFactory } from './notifications-cleanup.factory';
import { CleanupService } from './cleanup.service';
import { CleanupFactory } from './cleanup.factory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  providers: [
    InactiveUsersCleanupTask,
    ReadNotificationsCleanupTask,
    UsersCleanupFactory,
    NotificationsCleanupFactory,
    CleanupService,
    {
      provide: 'CleanupFactoryArray',
      useFactory: (
        usersCleanupFactory: UsersCleanupFactory,
        notificationsCleanupFactory: NotificationsCleanupFactory,
      ) => {
        return [usersCleanupFactory, notificationsCleanupFactory];
      },
      inject: [UsersCleanupFactory, NotificationsCleanupFactory],
    },
    {
      provide: CleanupService,
      useFactory: (factories: CleanupFactory[]) =>
        new CleanupService(factories),
      inject: ['CleanupFactoryArray'],
    },
  ],
})
export class CleanupModule {}
