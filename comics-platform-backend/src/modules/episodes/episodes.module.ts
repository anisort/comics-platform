import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodesController } from '../../controllers/episodes/episodes.controller';
import { Episode } from 'src/entities/episode.entity';
import { EpisodesService } from 'src/services/episodes/episodes.service';
import { AuthModule } from '../auth/auth.module';
import { ComicsModule } from '../comics/comics.module';
import { UploadModule } from '../upload/upload.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EpisodeNotificationService } from 'src/services/episode-notification/episode-notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Episode]),
    JwtModule,
    AuthModule,
    ComicsModule,
    UploadModule,
    SubscriptionModule,
    NotificationsModule,
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService, EpisodeNotificationService],
  exports: [EpisodesService],
})
export class EpisodesModule {}
