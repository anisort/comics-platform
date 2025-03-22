import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '../upload/upload.module'; 
import { ConfigModule } from '@nestjs/config';
import { Comic } from 'src/entities/comic.entity';
import { ComicsController } from 'src/controllers/comics/comics.controller';
import { ComicsService } from 'src/services/comics/comics.service';
import { GenresModule } from '../genres/genres.module';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from 'src/services/upload/upload.service';
import { GenresService } from 'src/services/genres/genres.service';
import { UsersService } from 'src/services/users/users.service';

@Module({
  imports: [
    MulterModule.register({
      dest: '../../../uploads'
    }),
    TypeOrmModule.forFeature([Comic]), 
    UploadModule,
    ConfigModule, 
    GenresModule,
    UsersModule
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}