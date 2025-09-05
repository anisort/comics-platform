import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { IsUniqueConstraint } from './validators/is-unique-constraint.validator';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { GenresModule } from './modules/genres/genres.module';
import { ComicsModule } from './modules/comics/comics.module';
import { Comic } from './entities/comic.entity';
import { Genre } from './entities/genre.entity';
import { EpisodesModule } from './modules/episodes/episodes.module';
import { PagesModule } from './modules/pages/pages.module';
import { Episode } from './entities/episode.entity';
import { Page } from './entities/page.entity';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { Notification } from './entities/notification.entity';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CleanupModule } from './cleanup/cleanup.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Comic, Genre, Episode, Page, Notification],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    UploadModule,
    GenresModule,
    ComicsModule,
    ConfigModule.forRoot(),
    EpisodesModule,
    PagesModule,
    SubscriptionModule,
    NotificationsModule,
    MailModule,
    ...(process.env.NODE_ENV === 'test' ? [] : [CleanupModule]),
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
