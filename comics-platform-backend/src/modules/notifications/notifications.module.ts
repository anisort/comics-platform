import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { NotificationsService } from 'src/services/notifications/notifications.service';
import { NotificationsController } from 'src/controllers/notifications/notifications.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { SUBSCRIBERS } from 'src/observers/subscriber.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    JwtModule,
    AuthModule
],
  providers: [
    NotificationsService,
    {
      provide: SUBSCRIBERS,
      useFactory: (notificationsService: NotificationsService) => [notificationsService],
      inject: [NotificationsService],
    },
  ],
  controllers: [NotificationsController],
  exports: [NotificationsService, SUBSCRIBERS],
})
export class NotificationsModule {}
